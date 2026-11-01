/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ThemeAndTextProvider, useThemeAndText } from './context/ThemeAndTextContext.tsx';
import { Navbar, type MainNavDestination } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { UploadScreen } from './components/UploadScreen.tsx';
import { LessonView } from './components/LessonView.tsx';
import { PracticeHub } from './components/PracticeHub.tsx';
import { PlannerView } from './components/PlannerView.tsx';
import { LibraryView } from './components/LibraryView.tsx';
import { ContentAuditLedger } from './components/ContentAuditLedger.tsx';
import { PomodoroTimer } from './components/PomodoroTimer.tsx';
import { MemoChatbot } from './components/MemoChatbot.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { AdminPanelModal } from './components/AdminPanelModal.tsx';
import { FeedbackModal } from './components/FeedbackModal.tsx';
import { StudyGuidePrepModal } from './components/StudyGuidePrepModal.tsx';
import { Headphones, CheckCircle2, ArrowRight } from './components/icons.tsx';
import { playCalmChime, playSoftTap } from './utils/audioChimes.ts';
import type {
  CourseData,
  Question,
  QuizAnswer,
  MistakeRecord,
  Section,
  StudyConfiguration,
  UploadedFileItem,
} from './types.ts';

const STORAGE_COURSE_KEY = 'lfmd_active_course_v2';
const STORAGE_PROGRESS_KEY = 'lfmd_active_progress_v2';
const STORAGE_CONFIG_KEY = 'memo_study_config_v1';

export function AppContent() {
  const { fontSizeClass, setTextSize, setTheme, theme, uiDensity } = useThemeAndText();

  // Study Configuration State (used across lessons, settings, and Memo companion)
  const [studyConfig, setStudyConfig] = useState<StudyConfiguration>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fontSize: 'standard',
      theme: 'daylight',
      plainWordsDefault: false,
      studyPace: 'calm',
      audioFeedback: true,
      questionTypeFilter: 'all',
      autoAdvanceChunks: false,
    };
  });

  const handleUpdateStudyConfig = (newConfig: Partial<StudyConfiguration>) => {
    setStudyConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(updated));
      } catch {}

      // Sync with ThemeAndTextContext
      if (newConfig.fontSize) {
        if (newConfig.fontSize === 'standard') setTextSize('normal');
        else if (newConfig.fontSize === 'large') setTextSize('large');
        else if (newConfig.fontSize === 'xlarge') setTextSize('xlarge');
      }
      if (newConfig.theme) {
        if (newConfig.theme === 'slate' || newConfig.theme === 'twilight') {
          setTheme('cosmic');
        } else {
          setTheme('meadow');
        }
      }

      return updated;
    });
  };

  // State to control Memo drawer open/close
  const [isMemoOpen, setIsMemoOpen] = useState(false);

  // State to control Settings modal open/close
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // State to control Admin Panel modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // State to control Feedback modal
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // State to control Pomodoro timer modal
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  // State to control Study Readiness & Preparation Guide modal
  const [isStudyPrepOpen, setIsStudyPrepOpen] = useState(false);

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

  const [activeNav, setActiveNav] = useState<MainNavDestination>('learn');
  const [readinessBannerDismissed, setReadinessBannerDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymate_readiness_dismissed') === 'true';
    } catch {
      return false;
    }
  });
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
    files?: UploadedFileItem[];
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
      const fileCount = docPayload.files?.length || 1;
      setProgressStep(
        fileCount > 1
          ? `Loading & ingesting ${fileCount} documents...`
          : 'Reading and cleaning document contents...'
      );
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
      setProgressStep('Outlining curriculum topics and chapter boundaries...');
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
    setProgressStep(`Structuring lesson 1 of ${sectionsData!.length} & self-test questions...`);
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
      setActiveNav('learn');
      // Non-blocking readiness prompt banner is shown instead of interrupting with a forced modal

      // Record upload in Admin store & localStorage for administrative inspection
      const uploadRecord = {
        documentTitle: newCourse.documentTitle,
        fileNames: docPayload.files ? docPayload.files.map((f) => f.fileName) : [docPayload.fileName],
        fileTypes: docPayload.files ? docPayload.files.map((f) => f.fileType) : [docPayload.fileType],
        totalSize: docPayload.files
          ? docPayload.files.reduce((acc, f) => acc + (f.fileSize || 0), 0)
          : (docPayload.documentText?.length || 5000),
        sectionCount: sectionsData!.length,
        contentSnippet: cleanData!.cleanedText ? cleanData!.cleanedText.slice(0, 240) + '...' : '',
        fullCleanedText: cleanData!.cleanedText,
        skippedItems: cleanData!.skippedContent || [],
        userId: 'usr_scholar_active',
        userEmail: 'alex.scholar@example.com',
      };

      fetch('/api/record-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadRecord),
      }).catch(() => {});

      try {
        const stored = localStorage.getItem('studymate_admin_uploads');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift({
          id: `upload_${Date.now()}`,
          ...uploadRecord,
          uploadedAt: new Date().toISOString(),
        });
        localStorage.setItem('studymate_admin_uploads', JSON.stringify(list));
      } catch {}
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
    files?: UploadedFileItem[];
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
      playSoftTap(studyConfig.audioFeedback);
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
      playCalmChime(studyConfig.audioFeedback);
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
    setActiveNav('learn');
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
    <div className="min-h-screen w-full bg-[#EDF0F5] dark:bg-[#12151B] text-[#3A3F4F] dark:text-[#F1F3F7] flex flex-col font-sans antialiased transition-colors overflow-x-hidden">
      <Navbar
        course={isProcessing ? null : course}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        mistakesCount={mistakes.length}
        completedSectionCount={completedSectionIndices.length}
        totalSections={course?.sections.length || 0}
        onNewDocumentClick={() => setShowNewDocConfirm(true)}
        onOpenMemo={() => setIsMemoOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        onOpenStudyPrep={() => setIsStudyPrepOpen(true)}
      />

      <main className="flex-1 w-full flex flex-col overflow-hidden">
        {!course || isProcessing ? (
          <UploadScreen
            onStartCourse={handleStartCourse}
            isProcessing={isProcessing}
            progressStep={progressStep}
            errorMessage={errorMessage}
            onRetry={handleRetryStep}
            onOpenMemo={() => setIsMemoOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
          />
        ) : (
          <div
            className={`flex-1 w-full flex flex-col lg:flex-row min-h-0 lg:h-[calc(100vh-3.75rem)] lg:overflow-hidden transition-colors ${
              theme === 'academia'
                ? 'bg-[#FAF6EE] dark:bg-[#0E1117]'
                : 'bg-[#F4F7F4] dark:bg-[#0E1117]'
            }`}
          >
            {/* Mobile View: Collapsible Lesson Dropdown Selector at Top */}
            {activeNav === 'learn' && (
              <Sidebar
                course={course}
                currentSectionIndex={currentSectionIndex}
                onSelectSection={(idx) => setCurrentSectionIndex(idx)}
                completedSectionIndices={completedSectionIndices}
                onRetrySection={handleRetrySection}
                onOpenMemo={() => setIsMemoOpen(true)}
                mobileOnly={true}
              />
            )}

            {/* Desktop View: Dedicated Left Panel (Course Sections, 3D Memo & Key Notes) */}
            {activeNav === 'learn' && (
              <Sidebar
                course={course}
                currentSectionIndex={currentSectionIndex}
                onSelectSection={(idx) => setCurrentSectionIndex(idx)}
                completedSectionIndices={completedSectionIndices}
                onRetrySection={handleRetrySection}
                onOpenMemo={() => setIsMemoOpen(true)}
                desktopOnly={true}
              />
            )}

            {/* Main Content Area: Pristine, focused reading layout without clutter */}
            <div className="flex-1 min-h-0 w-full h-full overflow-y-auto bg-transparent flex flex-col p-3 sm:p-5 lg:p-7 pb-24 md:pb-8">
              {/* Optional Non-blocking Readiness Prompt */}
              {activeNav === 'learn' && !readinessBannerDismissed && (
                <div className="max-w-3xl xl:max-w-4xl mx-auto w-full mb-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-850 border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#006A4E] dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                        Ready to focus?
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Continue your lesson or take 30 seconds to set up your study space.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsStudyPrepOpen(true)}
                      className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    >
                      Set up study space
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReadinessBannerDismissed(true);
                        try {
                          localStorage.setItem('studymate_readiness_dismissed', 'true');
                        } catch {}
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#1A6EF0] hover:bg-[#1558C4] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Start lesson
                    </button>
                  </div>
                </div>
              )}

              {/* 1. LEARN HUB: FOCUSED STUDY NOW VIEW */}
              {activeNav === 'learn' && currentSection && (
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
                  studyConfig={studyConfig}
                  onOpenMemo={() => setIsMemoOpen(true)}
                />
              )}

              {/* 2. PRACTICE HUB: FLASHCARDS, FINAL QUIZ, MISTAKES, EXAM PREP */}
              {activeNav === 'practice' && (
                <PracticeHub
                  course={course}
                  mistakes={mistakes}
                  onCorrectMistake={handleCorrectMistake}
                  onRecordMistakeAgain={handleRecordMistakeAgain}
                  onJumpToLesson={(idx) => {
                    setCurrentSectionIndex(idx);
                    setActiveNav('learn');
                  }}
                />
              )}

              {/* 3. PLAN HUB: HABIT TRACKER, POMODORO TIMER, STUDY READINESS */}
              {activeNav === 'plan' && (
                <PlannerView
                  course={course}
                  completedSectionCount={completedSectionIndices.length}
                  onStartQuiz={() => setActiveNav('practice')}
                  onOpenNotes={() => setActiveNav('library')}
                  onBrowseLibrary={() => setShowNewDocConfirm(true)}
                  onOpenStudyPrep={() => setIsStudyPrepOpen(true)}
                />
              )}

              {/* 4. LIBRARY HUB: DOCUMENT OVERVIEW, EXTRACTED NOTES, MULTI-UPLOAD */}
              {activeNav === 'library' && (
                <LibraryView
                  course={course}
                  onNewDocumentClick={() => setShowNewDocConfirm(true)}
                  onSelectSection={(idx) => {
                    setCurrentSectionIndex(idx);
                    setActiveNav('learn');
                  }}
                  onOpenAudit={() => setActiveNav('audit')}
                />
              )}

              {/* 5. AUDIT VIEW: CONTENT INTEGRITY & PROOF */}
              {activeNav === 'audit' && <ContentAuditLedger course={course} />}
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
      {/* Memo 3D Chatbot Companion (Always available to ask doubts and configure study) */}
      <MemoChatbot
        isOpen={isMemoOpen}
        onToggleOpen={() => setIsMemoOpen((prev) => !prev)}
        currentSection={currentSection}
        fullDocumentText={
          cleanedDocCache?.cleanedText ||
          (course ? course.sections.map((s) => s.content).join('\n\n') : '')
        }
        courseData={course}
        studyConfig={studyConfig}
        onUpdateStudyConfig={handleUpdateStudyConfig}
        onNavigateToSection={(idx) => {
          setCurrentSectionIndex(idx);
          setActiveNav('learn');
        }}
        onOpenFullSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal (Theme, Pacing, Audio & About the Creator by Hamza Rashid) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        studyConfig={studyConfig}
        onUpdateStudyConfig={handleUpdateStudyConfig}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Admin System Portal (Secured with creator key 9656756757) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentCourseCleanedText={cleanedDocCache?.cleanedText}
        currentCourseTitle={course?.documentTitle}
        onOpenFeedback={() => {
          setIsAdminOpen(false);
          setIsFeedbackOpen(true);
        }}
      />

      {/* User Feedback & Suggestions Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        defaultEmail=""
        audioEnabled={studyConfig.audioFeedback}
      />

      {/* Pomodoro Focus & Interval Modal */}
      <PomodoroTimer
        isOpenModal={isPomodoroOpen}
        onCloseModal={() => setIsPomodoroOpen(false)}
      />

      {/* Study Readiness & Preparation Guide Modal */}
      <StudyGuidePrepModal
        isOpen={isStudyPrepOpen}
        onClose={() => setIsStudyPrepOpen(false)}
        onStartStudy={() => {
          setActiveNav('learn');
          setIsStudyPrepOpen(false);
        }}
        documentTitle={course?.documentTitle}
      />
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
