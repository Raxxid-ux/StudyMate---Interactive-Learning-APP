/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ThemeAndTextProvider, useThemeAndText } from './context/ThemeAndTextContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { UploadScreen } from './components/UploadScreen.tsx';
import { LessonView } from './components/LessonView.tsx';
import { ReviewMistakesView } from './components/ReviewMistakesView.tsx';
import { FlashcardsView } from './components/FlashcardsView.tsx';
import { FinalQuizView } from './components/FinalQuizView.tsx';
import { ContentAuditLedger } from './components/ContentAuditLedger.tsx';
import type { CourseData, Question, QuizAnswer, MistakeRecord, Section } from './types.ts';

const STORAGE_COURSE_KEY = 'lfmd_active_course_v2';
const STORAGE_PROGRESS_KEY = 'lfmd_active_progress_v2';

export function AppContent() {
  const { fontSizeClass } = useThemeAndText();

  // Course & Navigation State
  const [course, setCourse] = useState<CourseData | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COURSE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to load course from storage:', e);
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'lesson' | 'flashcards' | 'mistakes' | 'final-quiz' | 'audit'>('lesson');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Progress State
  const [completedSectionIndices, setCompletedSectionIndices] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.completedSectionIndices || [];
      }
    } catch {}
    return [];
  });

  const [sectionAnswers, setSectionAnswers] = useState<Record<string, QuizAnswer>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.sectionAnswers || {};
      }
    } catch {}
    return {};
  });

  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.mistakes || [];
      }
    } catch {}
    return [];
  });

  // Upload & Extraction State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Retry tracking: retry only the failed step
  const [failedStep, setFailedStep] = useState<'clean' | 'plan' | 'lesson0' | null>(null);
  const [lastUploadedDoc, setLastUploadedDoc] = useState<{
    fileName: string;
    fileType: string;
    documentText?: string;
    pdfBase64?: string;
  } | null>(null);
  const [cleanedDocCache, setCleanedDocCache] = useState<{
    cleanedText: string;
    documentTitle: string;
    skippedContent: string[];
    firstSentence: string;
    lastSentence: string;
  } | null>(null);
  const [plannedSectionsCache, setPlannedSectionsCache] = useState<Section[] | null>(null);

  // Confirmation Modal for New Document
  const [showNewDocConfirm, setShowNewDocConfirm] = useState(false);

  // Background Plain Words state
  const [isFetchingPlainWords, setIsFetchingPlainWords] = useState(false);

  // Ref to prevent duplicate background runs
  const isBuildingRef = useRef(false);

  // Save Course to localStorage
  useEffect(() => {
    try {
      if (course) {
        localStorage.setItem(STORAGE_COURSE_KEY, JSON.stringify(course));
      } else {
        localStorage.removeItem(STORAGE_COURSE_KEY);
      }
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [course]);

  // Save Progress to localStorage
  useEffect(() => {
    try {
      if (course) {
        const progressData = {
          courseId: course.id,
          completedSectionIndices,
          sectionAnswers,
          mistakes,
        };
        localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progressData));
      } else {
        localStorage.removeItem(STORAGE_PROGRESS_KEY);
      }
    } catch (e) {
      console.warn('Storage progress save failed:', e);
    }
  }, [course, completedSectionIndices, sectionAnswers, mistakes]);

  // Helper to build a specific section lesson
  const buildSectionLesson = async (
    sectionIndex: number,
    sectionTitle: string,
    sectionContent: string,
    totalSections: number
  ) => {
    setCourse((prev) => {
      if (!prev) return null;
      const updated = [...prev.sections];
      if (updated[sectionIndex]) {
        updated[sectionIndex] = {
          ...updated[sectionIndex],
          status: 'building',
          errorMessage: undefined,
        };
      }
      return { ...prev, sections: updated };
    });

    try {
      const res = await fetch('/api/build-section-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle,
          sectionContent,
          sectionIndex,
          totalSections,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed building lesson ${sectionIndex + 1}`);
      }

      const lessonData = await res.json();
      const formattedQuestions: Question[] = (lessonData.questions || []).map((q: any) => ({
        ...q,
        sectionIndex,
        sectionTitle,
      }));

      setCourse((prev) => {
        if (!prev) return null;
        const updated = [...prev.sections];
        if (updated[sectionIndex]) {
          updated[sectionIndex] = {
            ...updated[sectionIndex],
            status: 'ready',
            lesson: {
              intro: lessonData.intro || '',
              chunks: lessonData.chunks || [],
              keyPoints: lessonData.keyPoints || [],
              questions: formattedQuestions,
              glossary: lessonData.glossary || [],
              steps: lessonData.steps || [],
              skippedItems: lessonData.skippedItems || [],
            },
          };
        }
        return { ...prev, sections: updated };
      });
      return true;
    } catch (err: any) {
      console.error(`Error building lesson ${sectionIndex + 1}:`, err);
      setCourse((prev) => {
        if (!prev) return null;
        const updated = [...prev.sections];
        if (updated[sectionIndex]) {
          updated[sectionIndex] = {
            ...updated[sectionIndex],
            status: 'error',
            errorMessage: err.message || 'Lesson generation error',
          };
        }
        return { ...prev, sections: updated };
      });
      return false;
    }
  };

  // Pipeline Execution
  const executePipeline = async (
    startFromStep: 'clean' | 'plan' | 'lesson0',
    docPayload: typeof lastUploadedDoc
  ) => {
    if (!docPayload) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setFailedStep(null);

    let cleanData = cleanedDocCache;
    let sectionsData = plannedSectionsCache;

    // STEP 2: Read and clean
    if (startFromStep === 'clean' || !cleanData) {
      setProgressStep('Reading your document...');
      try {
        const cleanRes = await fetch('/api/clean-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(docPayload),
        });

        if (!cleanRes.ok) {
          const errJson = await cleanRes.json().catch(() => ({}));
          throw new Error(errJson.error || 'Failed to read and clean your document.');
        }

        cleanData = await cleanRes.json();
        setCleanedDocCache(cleanData);
      } catch (err: any) {
        setIsProcessing(false);
        setFailedStep('clean');
        setErrorMessage(err.message || 'Could not read your document. Please try again.');
        return;
      }
    }

    // STEP 3: Plan and merge
    if (startFromStep === 'clean' || startFromStep === 'plan' || !sectionsData) {
      setProgressStep('Planning your lessons...');
      try {
        const planRes = await fetch('/api/plan-and-merge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cleanedText: cleanData!.cleanedText,
            documentTitle: cleanData!.documentTitle,
          }),
        });

        if (!planRes.ok) {
          const errJson = await planRes.json().catch(() => ({}));
          throw new Error(errJson.error || 'Failed to plan your course.');
        }

        const planData = await planRes.json();
        sectionsData = (planData.sections || []).map((sec: any, idx: number) => ({
          sectionIndex: idx,
          title: sec.title || `Lesson ${idx + 1}`,
          mergedParts: sec.mergedParts || [sec.title],
          content: sec.content || '',
          status: (idx === 0 ? 'building' : 'pending') as 'pending' | 'building' | 'ready' | 'error',
        }));
        setPlannedSectionsCache(sectionsData);
      } catch (err: any) {
        setIsProcessing(false);
        setFailedStep('plan');
        setErrorMessage(err.message || 'Could not plan lessons. Please try again.');
        return;
      }
    }

    // STEP 4: Build Lesson 1 first
    setProgressStep(`Building lesson 1 of ${sectionsData!.length}...`);
    try {
      const s0Res = await fetch('/api/build-section-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: sectionsData![0].title,
          sectionContent: sectionsData![0].content,
          sectionIndex: 0,
          totalSections: sectionsData!.length,
        }),
      });

      if (!s0Res.ok) {
        const errJson = await s0Res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed building lesson 1.');
      }

      const s0Data = await s0Res.json();
      const formattedQuestions: Question[] = (s0Data.questions || []).map((q: any) => ({
        ...q,
        sectionIndex: 0,
        sectionTitle: sectionsData![0].title,
      }));

      sectionsData![0] = {
        ...sectionsData![0],
        status: 'ready',
        lesson: {
          intro: s0Data.intro || '',
          chunks: s0Data.chunks || [],
          keyPoints: s0Data.keyPoints || [],
          questions: formattedQuestions,
          glossary: s0Data.glossary || [],
          steps: s0Data.steps || [],
          skippedItems: s0Data.skippedItems || [],
        },
      };

      const newCourse: CourseData = {
        id: `course_${Date.now()}`,
        documentTitle: cleanData!.documentTitle || docPayload.fileName,
        fileName: docPayload.fileName,
        sections: sectionsData!,
        skippedContent: cleanData!.skippedContent || [],
        firstSentence: cleanData!.firstSentence || '',
        lastSentence: cleanData!.lastSentence || '',
        createdAt: new Date().toISOString(),
      };

      setCourse(newCourse);
      setCompletedSectionIndices([]);
      setSectionAnswers({});
      setMistakes([]);
      setCurrentSectionIndex(0);
      setIsProcessing(false);
      setActiveTab('lesson');
    } catch (err: any) {
      setIsProcessing(false);
      setFailedStep('lesson0');
      setErrorMessage(err.message || 'Could not build lesson 1. Please try again.');
    }
  };

  const handleStartCourse = (docData: {
    fileName: string;
    fileType: string;
    documentText?: string;
    pdfBase64?: string;
  }) => {
    setLastUploadedDoc(docData);
    setCleanedDocCache(null);
    setPlannedSectionsCache(null);
    executePipeline('clean', docData);
  };

  // Retry only the failed step!
  const handleRetryStep = () => {
    if (lastUploadedDoc && failedStep) {
      executePipeline(failedStep, lastUploadedDoc);
    } else if (lastUploadedDoc) {
      executePipeline('clean', lastUploadedDoc);
    }
  };

  // Background builder effect for remaining sections
  useEffect(() => {
    if (!course || isProcessing || isBuildingRef.current) return;

    const nextPendingIndex = course.sections.findIndex((s) => s.status === 'pending');
    if (nextPendingIndex !== -1) {
      const sec = course.sections[nextPendingIndex];
      isBuildingRef.current = true;
      buildSectionLesson(
        nextPendingIndex,
        sec.title,
        sec.content,
        course.sections.length
      ).finally(() => {
        isBuildingRef.current = false;
      });
    }
  }, [course, isProcessing]);

  // Retry a specific background section that failed
  const handleRetrySection = async (index: number) => {
    if (!course || !course.sections[index]) return;
    const sec = course.sections[index];
    await buildSectionLesson(index, sec.title, sec.content, course.sections.length);
  };

  // Plain words fetcher
  const handleFetchPlainWords = async (sectionIndex: number) => {
    if (!course || !course.sections[sectionIndex]) return;
    const sec = course.sections[sectionIndex];
    if (sec.lesson?.plainWords) return;

    setIsFetchingPlainWords(true);
    try {
      const res = await fetch('/api/plain-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: sec.title,
          sectionContent: sec.content,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCourse((prev) => {
          if (!prev) return null;
          const updated = [...prev.sections];
          if (updated[sectionIndex] && updated[sectionIndex].lesson) {
            updated[sectionIndex] = {
              ...updated[sectionIndex],
              lesson: {
                ...updated[sectionIndex].lesson!,
                plainWords: data.plainWordsText,
              },
            };
          }
          return { ...prev, sections: updated };
        });
      }
    } catch (e) {
      console.error('Plain words error:', e);
    } finally {
      setIsFetchingPlainWords(false);
    }
  };

  // Answer question in quiz
  const handleAnswerQuestion = (question: Question, selectedAnswer: string) => {
    const isCorrect = selectedAnswer === question.correctAnswer;

    setSectionAnswers((prev) => ({
      ...prev,
      [question.id]: {
        questionId: question.id,
        selectedAnswer,
        isCorrect,
        revealed: true,
      },
    }));

    if (!isCorrect) {
      setMistakes((prev) => {
        const filtered = prev.filter((m) => m.questionId !== question.id);
        return [
          ...filtered,
          {
            questionId: question.id,
            question,
            studentAnswer: selectedAnswer,
            recordedAt: new Date().toISOString(),
          },
        ];
      });
    } else {
      setMistakes((prev) => prev.filter((m) => m.questionId !== question.id));
    }
  };

  const handleCorrectMistake = (questionId: string) => {
    setMistakes((prev) => prev.filter((m) => m.questionId !== questionId));
    setSectionAnswers((prev) => {
      const existing = prev[questionId];
      if (existing) {
        return { ...prev, [questionId]: { ...existing, isCorrect: true } };
      }
      return prev;
    });
  };

  const handleRecordMistakeAgain = (question: Question, wrongAnswer: string) => {
    setMistakes((prev) => {
      const filtered = prev.filter((m) => m.questionId !== question.id);
      return [
        ...filtered,
        {
          questionId: question.id,
          question,
          studentAnswer: wrongAnswer,
          recordedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const handleMarkSectionCompleted = (index: number) => {
    setCompletedSectionIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleConfirmNewDoc = () => {
    setCourse(null);
    setCompletedSectionIndices([]);
    setSectionAnswers({});
    setMistakes([]);
    setCurrentSectionIndex(0);
    setActiveTab('lesson');
    setShowNewDocConfirm(false);
    setCleanedDocCache(null);
    setPlannedSectionsCache(null);
    try {
      localStorage.removeItem(STORAGE_COURSE_KEY);
      localStorage.removeItem(STORAGE_PROGRESS_KEY);
    } catch {}
  };

  const currentSection = course?.sections[currentSectionIndex] || null;

  return (
    <div className="min-h-screen bg-[#EDF0F5] dark:bg-[#12151B] text-[#3A3F4F] dark:text-[#F1F3F7] flex flex-col font-sans antialiased transition-colors">
      <Navbar
        course={isProcessing ? null : course}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mistakes={mistakes}
        onNewDocumentClick={() => setShowNewDocConfirm(true)}
        completedSectionCount={completedSectionIndices.length}
      />

      <main className="flex-1 flex flex-col">
        {!course || isProcessing ? (
          <UploadScreen
            onStartCourse={handleStartCourse}
            isProcessing={isProcessing}
            progressStep={progressStep}
            errorMessage={errorMessage}
            onRetry={handleRetryStep}
          />
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Left Sidebar Menu */}
            {activeTab === 'lesson' && (
              <Sidebar
                course={course}
                currentSectionIndex={currentSectionIndex}
                onSelectSection={(idx) => setCurrentSectionIndex(idx)}
                completedSectionIndices={completedSectionIndices}
                onRetrySection={handleRetrySection}
              />
            )}

            {/* Right Lesson Content Area */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'lesson' && currentSection && (
                <LessonView
                  section={currentSection}
                  totalSections={course.sections.length}
                  onPreviousSection={() => setCurrentSectionIndex((prev) => Math.max(0, prev - 1))}
                  onNextSection={() => setCurrentSectionIndex((prev) => Math.min(course.sections.length - 1, prev + 1))}
                  hasPrevious={currentSectionIndex > 0}
                  hasNext={currentSectionIndex < course.sections.length - 1}
                  isCompleted={completedSectionIndices.includes(currentSectionIndex)}
                  onMarkSectionCompleted={handleMarkSectionCompleted}
                  sectionAnswers={sectionAnswers}
                  onAnswerQuestion={handleAnswerQuestion}
                  onFetchPlainWords={handleFetchPlainWords}
                  isFetchingPlainWords={isFetchingPlainWords}
                />
              )}

              {activeTab === 'flashcards' && <FlashcardsView course={course} />}

              {activeTab === 'mistakes' && (
                <ReviewMistakesView
                  mistakes={mistakes}
                  onCorrectMistake={handleCorrectMistake}
                  onRecordMistakeAgain={handleRecordMistakeAgain}
                  onJumpToSection={(idx) => {
                    setCurrentSectionIndex(idx);
                    setActiveTab('lesson');
                  }}
                />
              )}

              {activeTab === 'final-quiz' && <FinalQuizView course={course} />}

              {activeTab === 'audit' && <ContentAuditLedger course={course} />}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal for Starting a New Document */}
      {showNewDocConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#F9FAFC] dark:bg-[#1A1E27] rounded-3xl max-w-sm w-full p-6 space-y-4 border border-zinc-200/80 dark:border-zinc-800 shadow-xl">
            <h3 className="text-lg font-medium text-[#3A3F4F] dark:text-[#F1F3F7]">
              Start a new document?
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6573] dark:text-[#A6ACB9] leading-relaxed">
              This will clear the current course and your quiz progress so you can upload a new document.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowNewDocConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#5F6573] dark:text-[#A6ACB9] hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmNewDoc}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Yes, start over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeAndTextProvider>
      <AppContent />
    </ThemeAndTextProvider>
  );
}
