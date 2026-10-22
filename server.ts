/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  verifyQuoteInText,
  verifyKeyPoints,
  filterValidQuestions,
  enforceMaxSections,
  QuestionData,
} from './src/utils/quoteVerifier.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
}) {
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed:`, err.message?.slice(0, 100) || err);
    }
  }
  throw lastError;
}

// STEP 2: READ AND CLEAN (Gemini call #1)
app.post('/api/clean-document', async (req, res) => {
  try {
    const { documentText, pdfBase64, fileName, fileType } = req.body;

    if (pdfBase64) {
      const approxBytes = (pdfBase64.length * 3) / 4;
      if (approxBytes > 20 * 1024 * 1024) {
        return res.status(400).json({
          error: 'This PDF is larger than 20MB. Please choose a smaller document so we can process it calmly.',
        });
      }
    } else if (documentText) {
      if (documentText.length > 500000) {
        return res.status(400).json({
          error: 'This document is over 100,000 words. Please provide a shorter document for a calm, easy study course.',
        });
      }
      if (!documentText.trim()) {
        return res.status(400).json({ error: 'The document appears to be empty.' });
      }
    } else {
      return res.status(400).json({ error: 'No document content provided.' });
    }

    const cleanPrompt = `You are a text preparation and cleaning engine for a calm study course.
RULES FOR CLEANING:
1. Return the complete document text, cleaned of page numbers, running headers, and running footers.
2. If the document looks like a video or audio transcript (spoken style, timestamps, speaker labels, greetings, filler words, jokes, repeated sentences, "like and subscribe", "as I said before"):
   - Remove timestamps, speaker names, greetings, filler words, jokes, and repeated lines.
   - Join the spoken ideas into clear, written study sentences.
   - Do NOT add any new fact, example, or meaning.
3. NO NAMES RULE:
   - If the document names a person, company, or brand only as a side example, leave the name out and use neutral words like "one example" or "one organization".
   - If a name is the main idea/subject of the document, keep it exactly as the document says.
   - Never introduce any outside brand, company, or model names.
4. Return a list of anything unreadable or left out (images, charts, unclear parts). This becomes the Skipped Content Log.
5. Provide the exact first sentence and exact last sentence of the cleaned text.
6. Use low temperature (0.2). Return JSON matching the schema.`;

    let contentsPayload: any;
    if (pdfBase64) {
      contentsPayload = [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
            { text: cleanPrompt },
          ],
        },
      ];
    } else {
      contentsPayload = [
        {
          role: 'user',
          parts: [
            { text: `${cleanPrompt}\n\nORIGINAL DOCUMENT TEXT:\n${documentText}` },
          ],
        },
      ];
    }

    const response = await generateContentWithFallback({
      contents: contentsPayload,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentTitle: { type: Type.STRING },
            cleanedText: { type: Type.STRING },
            skippedContent: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            firstSentence: { type: Type.STRING },
            lastSentence: { type: Type.STRING },
          },
          required: ['documentTitle', 'cleanedText', 'skippedContent', 'firstSentence', 'lastSentence'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const cleaned = parsed.cleanedText || documentText || '';

    res.json({
      documentTitle: parsed.documentTitle || fileName?.replace(/\.[^/.]+$/, '') || 'Your Document',
      cleanedText: cleaned,
      skippedContent: Array.isArray(parsed.skippedContent) ? parsed.skippedContent : [],
      firstSentence: parsed.firstSentence || '',
      lastSentence: parsed.lastSentence || '',
    });
  } catch (error: any) {
    console.error('Error in /api/clean-document:', error);
    res.status(500).json({
      error: error.message || 'Failed to read and clean your document. Please try again.',
    });
  }
});

// STEP 3: PLAN AND MERGE (Gemini call #2)
app.post('/api/plan-and-merge', async (req, res) => {
  try {
    const { cleanedText, documentTitle } = req.body;

    if (!cleanedText || !cleanedText.trim()) {
      return res.status(400).json({ error: 'Cleaned text is empty.' });
    }

    const planPrompt = `You are a calm study curriculum planner.
TASK:
Group this document's content into FEW, cohesive sections. Merge related topics into ONE section.
RULES:
1. Merge related topics into ONE section:
   - If two parts share the same topic, or one is a deeper part of the other (e.g. "Introduction to X" followed by more about X), they MUST become one section.
   - Do NOT split one topic only because the document has a new heading or subheading.
2. Section limits:
   - Aim for 3 to 6 sections. NEVER more than 8 sections, even for long text.
   - Each section should be about 300 to 600 words of study content.
   - One section = one main idea.
3. Give each merged section a short, simple title using the document's own words.
4. Keep the document's overall order.
5. In 'content', include the exact original cleaned text that belongs to this section.
6. In 'mergedParts', list the short names of the sub-topics or original parts merged into it.
7. NO NAMES RULE: No brand, company, or person names unless it is the core topic.

DOCUMENT TITLE: ${documentTitle || 'Your Document'}
CLEANED TEXT:
${cleanedText}`;

    const response = await generateContentWithFallback({
      contents: [{ role: 'user', parts: [{ text: planPrompt }] }],
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentTitle: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionIndex: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  mergedParts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  content: { type: Type.STRING },
                },
                required: ['sectionIndex', 'title', 'mergedParts', 'content'],
              },
            },
          },
          required: ['documentTitle', 'sections'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    let sections = Array.isArray(parsed.sections) ? parsed.sections : [];

    if (sections.length === 0) {
      sections = [
        {
          sectionIndex: 0,
          title: parsed.documentTitle || 'Core Overview',
          mergedParts: ['Full Document'],
          content: cleanedText,
        },
      ];
    }

    // CODE CHECK: Section size check: NEVER more than 8 sections!
    if (sections.length > 8) {
      sections = enforceMaxSections(sections, 8);
    }

    // Re-index cleanly
    const finalSections = sections.map((s: any, idx: number) => ({
      sectionIndex: idx,
      title: s.title || `Section ${idx + 1}`,
      mergedParts: Array.isArray(s.mergedParts) ? s.mergedParts : [s.title],
      content: s.content || '',
    }));

    res.json({
      documentTitle: parsed.documentTitle || documentTitle || 'Your Document',
      sections: finalSections,
    });
  } catch (error: any) {
    console.error('Error in /api/plan-and-merge:', error);
    res.status(500).json({
      error: error.message || 'Failed to plan and merge sections.',
    });
  }
});

// STEP 4: BUILD EACH LESSON (one Gemini call per section)
app.post('/api/build-section-lesson', async (req, res) => {
  try {
    const { sectionTitle, sectionContent, sectionIndex, totalSections } = req.body;

    if (!sectionContent || !sectionContent.trim()) {
      return res.status(400).json({ error: 'Section content is empty.' });
    }

    const lessonPrompt = `You are building a short, calm, easy study lesson for Section ${(sectionIndex || 0) + 1} of ${totalSections || 1}: "${sectionTitle}".
RULES FOR THE AI:
1. Use ONLY the provided section text below. No outside facts, examples, analogies, or definitions.
2. Use simple, short, human sentences. Keep the document's meaning and tone.
3. NO NAMES RULE: Never mention any company, brand, product, or person's name as a side example. If mentioned in text, use neutral words like "one example" or "one organization".
4. intro: exactly one short sentence saying what this section is about.
5. chunks: 3 to 5 small study chunks. Each chunk is 2 to 4 short sentences with a small chunk title.
6. keyPoints: 3 to 4 short points. Not more.
7. questions: 2 to 3 questions (mix of multiple-choice, true/false, or fill-in-the-blank).
   - Each question has: id, type, question, options, correctAnswer, and sourceQuote.
   - Wrong answer options MUST come from inside the document: swap terms, steps, numbers, or definitions found elsewhere in the text, or reverse a statement from the text.
   - For 'true-false', options MUST be ["True", "False"].
   - For 'fill-in-the-blank', question must contain "____" and options must provide 4 short word/phrase choices.
   - sourceQuote MUST be ONE exact sentence copied letter for letter from the ORIGINAL section text below (not from the rewritten chunks). If no exact sentence proves the answer, do NOT create that question.
8. glossary: only terms the document explains, using only the document's explanation. For a hard term it does not explain, use definition: "Mentioned in the text, but not defined in this document."
9. steps: if the section has a process, timeline, or comparison, return it as structured data using only the document's words. If none, return empty array.
10. If something is unclear, leave it out and report it in skippedItems. Never guess.

SECTION ORIGINAL TEXT:
${sectionContent}`;

    const response = await generateContentWithFallback({
      contents: [{ role: 'user', parts: [{ text: lessonPrompt }] }],
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intro: {
              type: Type.STRING,
              description: 'One short sentence saying what this section is about.',
            },
            chunks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: {
                    type: Type.STRING,
                    description: '2 to 4 short study sentences.',
                  },
                },
                required: ['id', 'title', 'content'],
              },
              description: '3 to 5 small study chunks.',
            },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 4 short points. Not more.',
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: {
                    type: Type.STRING,
                    enum: ['multiple-choice', 'true-false', 'fill-in-the-blank'],
                  },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.STRING },
                  sourceQuote: {
                    type: Type.STRING,
                    description: 'One exact sentence copied letter for letter from the original section text.',
                  },
                },
                required: ['id', 'type', 'question', 'options', 'correctAnswer', 'sourceQuote'],
              },
            },
            glossary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ['term', 'definition'],
              },
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['process', 'timeline', 'comparison'] },
                  title: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        detail: { type: Type.STRING },
                      },
                      required: ['label', 'detail'],
                    },
                  },
                },
                required: ['type', 'title', 'items'],
              },
            },
            skippedItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['intro', 'chunks', 'keyPoints', 'questions', 'glossary'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const intro = parsed.intro || `This lesson covers ${sectionTitle.toLowerCase()}.`;
    const chunks = Array.isArray(parsed.chunks) ? parsed.chunks : [];
    const rawKeyPoints: string[] = Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 4) : [];
    const rawQuestions: QuestionData[] = Array.isArray(parsed.questions) ? parsed.questions.slice(0, 3) : [];
    const glossary = Array.isArray(parsed.glossary) ? parsed.glossary : [];
    const steps = Array.isArray(parsed.steps) ? parsed.steps : [];
    const skippedItems: string[] = Array.isArray(parsed.skippedItems) ? parsed.skippedItems : [];

    // CODE CHECKS: Quote verification
    const { valid: verifiedQuestions, invalid: questionsToRetry } = filterValidQuestions(rawQuestions, sectionContent);

    // Try ONCE to regenerate each question that failed quote verification
    const retryPromises = questionsToRetry.map(async (failItem) => {
      try {
        const retryPrompt = `A question failed quote validation because its sourceQuote was not found letter-for-letter in the original section text.
ORIGINAL SECTION TEXT:
${sectionContent}

FAILED QUESTION:
Question: ${failItem.question.question}
Correct Answer: ${failItem.question.correctAnswer}
Provided Quote: ${failItem.question.sourceQuote}

TASK:
Find an EXACT sentence copied letter-for-letter from the original section text above that proves this answer, or return canProve=false.
Return JSON with { canProve: boolean, exactSentence: string }.`;

        const retryRes = await generateContentWithFallback({
          contents: [{ role: 'user', parts: [{ text: retryPrompt }] }],
          config: {
            temperature: 0.1,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                canProve: { type: Type.BOOLEAN },
                exactSentence: { type: Type.STRING },
              },
              required: ['canProve', 'exactSentence'],
            },
          },
        });

        const retryData = JSON.parse(retryRes.text || '{}');
        if (retryData.canProve && retryData.exactSentence && verifyQuoteInText(retryData.exactSentence, sectionContent)) {
          return {
            recovered: true as const,
            question: {
              ...failItem.question,
              sourceQuote: retryData.exactSentence,
            },
          };
        } else {
          return {
            recovered: false as const,
            reason: `Question omitted ("${failItem.question.question}"): source quote could not be verified letter for letter in original section text.`,
          };
        }
      } catch (err) {
        return {
          recovered: false as const,
          reason: `Question omitted ("${failItem.question.question}"): quote verification failed.`,
        };
      }
    });

    const retryResults = await Promise.all(retryPromises);
    const finalQuestions: QuestionData[] = [...verifiedQuestions];
    for (const r of retryResults) {
      if (r.recovered) {
        finalQuestions.push(r.question);
      } else {
        skippedItems.push(r.reason);
      }
    }

    res.json({
      sectionIndex,
      intro,
      chunks: chunks.length > 0 ? chunks : [
        { id: 'c1', title: 'Main Idea', content: sectionContent.slice(0, 300) }
      ],
      keyPoints: rawKeyPoints,
      questions: finalQuestions,
      glossary,
      steps,
      skippedItems,
    });
  } catch (error: any) {
    console.error('Error in /api/build-section-lesson:', error);
    res.status(500).json({
      error: error.message || 'Failed to build section lesson.',
    });
  }
});

// PLAIN WORDS (SIMPLER WORDING)
app.post('/api/plain-words', async (req, res) => {
  try {
    const { sectionTitle, sectionContent } = req.body;
    if (!sectionContent) {
      return res.status(400).json({ error: 'Section content is required.' });
    }

    const simplifyPrompt = `Reword the following section text into an even simpler, calmer wording for a beginner.
RULES:
1. Use ONLY the ideas in this section.
2. Reword ONLY what the document says. Do NOT add new facts, new outside examples, or new analogies.
3. Keep the author's meaning completely faithful to the text.
4. NO NAMES RULE: do not include brand, company, or person names as side examples.
5. Provide the simplified wording directly.

SECTION TITLE: ${sectionTitle}
SECTION TEXT:
${sectionContent}`;

    const response = await generateContentWithFallback({
      contents: [{ role: 'user', parts: [{ text: simplifyPrompt }] }],
      config: {
        temperature: 0.2,
      },
    });

    res.json({
      plainWordsText: response.text || '',
    });
  } catch (error: any) {
    console.error('Error in /api/plain-words:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate simpler wording.',
    });
  }
});

// STEP 6: MEMO CHATBOT - ASK DOUBTS & STUDY CONFIGURATIONS
app.post('/api/memo-ask', async (req, res) => {
  try {
    const {
      question,
      currentSectionTitle,
      currentSectionContent,
      fullDocumentText,
      chatHistory = [],
      currentConfigs = {},
    } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const memoSystemPrompt = `You are "Memo", a friendly, calm, minimalist study companion. You are visually embodied as a cute white minimal pen with a futuristic green-to-blue glowing lighting headgear.
Your goal is to help the student learn with less stress and zero overload.

CORE RULES:
1. NO NAMES RULE: Never mention any company name, brand name, product name, or person's name in your explanations, unless the person's name is the central topic of the document. Never mention AI providers, model names, or font vendors. Use neutral terms like "your document", "this section", "study draft".
2. GROUNDING FOR DOUBTS:
   - When answering questions or doubts about the lesson, rely ONLY on the provided document text or current section text.
   - Do NOT invent outside facts, examples, or theories.
   - If the doubt cannot be answered from the document, say gently: "That isn't covered in your document, but here is what your document does say about related topics..."
   - Include a short, direct source quote from the text when clarifying a concept whenever possible.
3. STUDY CONFIGURATIONS:
   - If the student asks how to configure their study environment, or asks you to adjust settings (like text size, dark/light theme, plain words mode, question types, study pace), guide them warmly.
   - If they request a specific change (e.g. "make text bigger", "switch to dark mode", "turn on plain words", "calm pace"), include a "suggestedConfigChange" object in the JSON:
     {
       "key": "fontSize" | "theme" | "plainWords" | "pace" | "soundEnabled",
       "value": any,
       "description": "Short explanation of change"
     }
4. TONE: Warm, encouraging, concise, calm. Maximum 2 to 3 short paragraphs. No jargon overload.

RESPONSE FORMAT (JSON ONLY):
{
  "answer": "string (your helpful response to the student)",
  "sourceQuote": "exact quote from text if answering a document doubt, else empty string",
  "suggestedConfigChange": null or { "key": string, "value": any, "description": string },
  "suggestedFollowUps": ["short question 1", "short question 2"]
}`;

    const contextSnippet = currentSectionContent
      ? `CURRENT SECTION: ${currentSectionTitle || 'Current Section'}\n${currentSectionContent}`
      : fullDocumentText
      ? `DOCUMENT EXCERPT:\n${String(fullDocumentText).slice(0, 8000)}`
      : 'No document text loaded yet.';

    const promptText = `STUDY CONFIGURATIONS CURRENT STATE:
${JSON.stringify(currentConfigs, null, 2)}

${contextSnippet}

STUDENT QUESTION / DOUBT:
${question}

Provide your response in JSON according to the schema.`;

    const response = await generateContentWithFallback({
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      config: {
        systemInstruction: memoSystemPrompt,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text || '{}');
    } catch {
      parsed = { answer: response.text || 'I am here with you to help with your study.' };
    }

    res.json({
      answer: parsed.answer || 'I am right here with you. What part would you like to explore together?',
      sourceQuote: parsed.sourceQuote || '',
      suggestedConfigChange: parsed.suggestedConfigChange || null,
      suggestedFollowUps: parsed.suggestedFollowUps || [
        'Can you explain this in simpler words?',
        'What are the key points of this section?',
        'How can I configure my study settings?',
      ],
    });
  } catch (error: any) {
    console.error('Error in /api/memo-ask:', error);
    res.status(500).json({
      error: error.message || 'Failed to answer doubt.',
      answer: 'I am here with you. Let us take it one calm step at a time.',
      suggestedFollowUps: ['Try again', 'Show key points'],
    });
  }
});

// Configure Vite middleware in development or static serve in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (dev mode: ${isDev})`);
  });
}

startServer();
