/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Normalizes text for verbatim quote checking:
 * Collapses whitespace, removes extraneous line breaks, trims.
 * Does not alter characters, casing or punctuation unless normalized whitespace.
 */
export function normalizeTextForCheck(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks whether sourceQuote exists word-for-word in sectionText
 * ignoring extra spaces and line breaks only.
 */
export function verifyQuoteInText(sourceQuote: string, sectionText: string): boolean {
  if (!sourceQuote || !sectionText) return false;
  const cleanQuote = normalizeTextForCheck(sourceQuote);
  const cleanSection = normalizeTextForCheck(sectionText);
  if (!cleanQuote || !cleanSection) return false;
  return cleanSection.includes(cleanQuote);
}

/**
 * Verifies key points against section text.
 * Returns array of validated key points and any invalid ones.
 */
export function verifyKeyPoints(
  keyPoints: string[],
  sectionText: string
): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const point of keyPoints) {
    if (verifyQuoteInText(point, sectionText)) {
      valid.push(point);
    } else {
      invalid.push(point);
    }
  }

  return { valid, invalid };
}

/**
 * Verifies questions have exact sourceQuote matching in the section text.
 */
export interface QuestionData {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
  question: string;
  options: string[];
  correctAnswer: string;
  sourceQuote: string;
}

export function filterValidQuestions(
  questions: QuestionData[],
  sectionText: string
): { valid: QuestionData[]; invalid: { question: QuestionData; reason: string }[] } {
  const valid: QuestionData[] = [];
  const invalid: { question: QuestionData; reason: string }[] = [];

  for (const q of questions) {
    if (!q.sourceQuote || q.sourceQuote.trim() === '') {
      invalid.push({
        question: q,
        reason: 'Missing source quote.',
      });
      continue;
    }
    if (!verifyQuoteInText(q.sourceQuote, sectionText)) {
      invalid.push({
        question: q,
        reason: `Source quote "${q.sourceQuote}" not found letter for letter in section text.`,
      });
      continue;
    }
    valid.push(q);
  }

  return { valid, invalid };
}

export function enforceMaxSections<T extends { title: string; content: string; mergedParts?: string[] }>(
  sections: T[],
  maxLimit = 8
): T[] {
  if (sections.length <= maxLimit) return sections;

  const result: T[] = [...sections];
  while (result.length > maxLimit) {
    // Find the smallest section to merge with its neighbor
    let minIdx = 0;
    let minLen = Infinity;
    for (let i = 0; i < result.length - 1; i++) {
      const combinedLen = (result[i].content?.length || 0) + (result[i + 1].content?.length || 0);
      if (combinedLen < minLen) {
        minLen = combinedLen;
        minIdx = i;
      }
    }

    const first = result[minIdx];
    const second = result[minIdx + 1];
    const merged: any = {
      ...first,
      title: `${first.title} & ${second.title}`.slice(0, 70),
      content: `${first.content}\n\n${second.content}`,
      mergedParts: [
        ...(first.mergedParts || [first.title]),
        ...(second.mergedParts || [second.title]),
      ],
    };

    result.splice(minIdx, 2, merged);
  }

  return result;
}

