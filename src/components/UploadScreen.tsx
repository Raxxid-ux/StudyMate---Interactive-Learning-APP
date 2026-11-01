/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Upload Screen
 * Supports multiple document uploads (PDF, TXT, MD), multi-file queue management,
 * and an informative multi-stage loading progress roadmap with live 3D Memo companion.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Settings,
  X,
  PlusCircle,
  FilePlus,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
} from './icons.tsx';
import { SAMPLE_DOCUMENTS, type SampleDoc } from '../sampleDocuments.ts';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import { MemoThreeCanvas } from './MemoThreeCanvas.tsx';
import { playCalmChime } from '../utils/audioChimes.ts';
import type { UploadedFileItem } from '../types.ts';

interface UploadScreenProps {
  onStartCourse: (docData: {
    fileName: string;
    fileType: string;
    documentText?: string;
    pdfBase64?: string;
    files?: UploadedFileItem[];
  }) => void;
  isProcessing: boolean;
  progressStep: string;
  errorMessage: string | null;
  onRetry: () => void;
  onOpenMemo?: () => void;
  onOpenSettings?: () => void;
  onOpenFeedback?: () => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onStartCourse,
  isProcessing,
  progressStep,
  errorMessage,
  onRetry,
  onOpenMemo,
  onOpenSettings,
  onOpenFeedback,
}) => {
  const { fontSizeClass, t, language, theme, toggleLanguage } = useThemeAndText();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileValidationWarning, setFileValidationWarning] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memo flight animation state around the Greetings heading
  const [isMemoFlightSettled, setIsMemoFlightSettled] = useState(false);
  const [memoGreetingMood, setMemoGreetingMood] = useState<'idle' | 'happy' | 'celebrate'>('happy');

  useEffect(() => {
    const flightTimer = setTimeout(() => {
      setIsMemoFlightSettled(true);
      setMemoGreetingMood('idle');
    }, 2800);
    return () => clearTimeout(flightTimer);
  }, []);

  // Rotating body contents with tips, tricks, and Did you know facts (no em dashes)
  const HOME_ROTATING_MESSAGES = [
    {
      type: 'intro',
      label: 'Interactive Course',
      text: 'StudyMate turns single or multiple documents into a short, calm, easy study course with Memo, your 3D interactive companion.',
    },
    {
      type: 'tip',
      label: 'Study Tip',
      text: 'Short 20 minute reading sessions help your brain lock in concepts without cognitive fatigue.',
    },
    {
      type: 'fact',
      label: 'Did You Know?',
      text: 'Did you know? Testing your recall right after reading a section can double your long term retention.',
    },
    {
      type: 'trick',
      label: 'Focus Trick',
      text: 'If a paragraph feels dense, toggle the Reading Tools popover to try Bionic Reading or plain wording.',
    },
    {
      type: 'fact',
      label: 'Did You Know?',
      text: 'Did you know? Taking a quick 5 minute walk resets your dopamine receptors and restores working memory.',
    },
    {
      type: 'trick',
      label: 'Pro Tip',
      text: 'You can select multiple documents at once. StudyMate cleans and synthesizes them into one clear curriculum.',
    },
    {
      type: 'tip',
      label: 'Study Tip',
      text: 'Keep a water bottle nearby. Even minor hydration drops can slow down mental processing speed.',
    },
  ];

  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [isSubFade, setIsSubFade] = useState(true);

  useEffect(() => {
    if (isProcessing || isReadingFiles) return;
    const subInterval = setInterval(() => {
      setIsSubFade(false);
      setTimeout(() => {
        setCurrentSubtitleIndex((prev) => (prev + 1) % HOME_ROTATING_MESSAGES.length);
        setIsSubFade(true);
      }, 250);
    }, 5500);
    return () => clearInterval(subInterval);
  }, [isProcessing, isReadingFiles]);

  // Motivational Quotes, Cognitive Facts & Study Tips
  const motivators = [
    {
      type: 'quote',
      text: '"The expert in anything was once a beginner." — Helen Hayes',
      textMl: '"ഏതൊരു കാര്യത്തിലും വിദഗ്ദ്ധനായ ഒരാളും ഒരിക്കൽ ഒരു തുടക്കക്കാരനായിരുന്നു." — ഹെലൻ ഹെയ്സ്',
    },
    {
      type: 'fact',
      text: 'Brain Science: Testing your memory shortly after reading doubles retention compared to passive re-reading.',
      textMl: 'തലച്ചോറിന്റെ രഹസ്യം: സ്വയം ചോദ്യങ്ങൾ ചോദിച്ച് പഠിക്കുന്നത് വിവരങ്ങൾ കൂടുതൽ കാലം ഓർമ്മയിൽ നിൽക്കാൻ സഹായിക്കും.',
    },
    {
      type: 'tip',
      text: 'Study Tip: Read chunks at a calm pace. Short pauses allow your brain to lock in concepts without fatigue.',
      textMl: 'പഠന സൂത്രം: സാവധാനം വായിച്ചു മനസ്സിലാക്കുക. ചെറിയ ഇടവേളകൾ കൂടുതൽ ഏകാഗ്രത നൽകും.',
    },
    {
      type: 'quote',
      text: '"Success is the sum of small efforts, repeated day in and day out." — Robert Collier',
      textMl: '"എല്ലാ ദിവസവും ചെയ്യുന്ന ചെറിയ പരിശ്രമങ്ങളുടെ ആകെത്തുകയാണ് വലിയ വിജയം." — റോബർട്ട് കോളിയർ',
    },
    {
      type: 'fact',
      text: 'Feynman Technique: Explaining a complex idea in simple plain words exposes hidden gaps and secures mastery.',
      textMl: 'ഫെയ്ൻമാൻ രീതി: പഠിച്ച കാര്യം ലളിതമായ വാക്കുകളിൽ മറ്റൊരാൾക്ക് പറഞ്ഞു കൊടുക്കാൻ ശ്രമിക്കുന്നത് പഠനം ഉറപ്പിക്കും.',
    },
    {
      type: 'tip',
      text: 'Focus Habit: Keep a glass of water nearby. Proper hydration keeps cognitive speed and alertness high.',
      textMl: 'ശ്രദ്ധ കൂട്ടാൻ: പഠിക്കുമ്പോൾ വെള്ളം കുടിക്കുന്നത് തലച്ചോറിന് ഉന്മേഷവും വേഗതയും നൽകും.',
    },
  ];

  const [motivatorIndex, setMotivatorIndex] = useState(0);

  useEffect(() => {
    if (!isProcessing && !isReadingFiles) return;
    const interval = setInterval(() => {
      setMotivatorIndex((prev) => (prev + 1) % motivators.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isProcessing, isReadingFiles, motivators.length]);

  const activeMotivator = motivators[motivatorIndex];

  // Informative loading screen stage determination
  const getActiveStageIndex = (step: string): number => {
    const s = (step || '').toLowerCase();
    if (s.includes('building lesson') || s.includes('lesson 1') || s.includes('questions')) {
      return 4; // Generating Quizzes & Lesson 1
    }
    if (s.includes('planning') || s.includes('outline') || s.includes('curriculum')) {
      return 2; // Outlining & Topic Synthesis
    }
    if (s.includes('clean') || s.includes('filtering') || s.includes('de-noising')) {
      return 1; // Cleaning & De-noising
    }
    if (s.includes('reading') || s.includes('loading') || s.includes('ingesting')) {
      return 0; // Reading & Ingesting
    }
    return 3; // Structuring Lessons
  };

  const activeStageIndex = getActiveStageIndex(progressStep);

  const stages = [
    {
      id: 'ingest',
      title: 'Loading & Ingesting Contents',
      desc: 'Parsing document structure, extracting text chunks & validating integrity',
    },
    {
      id: 'clean',
      title: 'Cleaning & De-noising Text',
      desc: 'Stripping running headers, footers, duplicate lines & spoken filler',
    },
    {
      id: 'outline',
      title: 'Outlining & Topic Synthesis',
      desc: 'Mapping core concepts, chapter boundaries & learning objectives',
    },
    {
      id: 'structure',
      title: 'Structuring Bite-Sized Lessons',
      desc: 'Dividing heavy material into calm, digestible study sections',
    },
    {
      id: 'questions',
      title: 'Formulating Questions & Flashcards',
      desc: 'Verifying quotes and preparing interactive self-tests for Lesson 1',
    },
  ];

  const handleFilesAdded = (files: FileList | File[]) => {
    setFileValidationWarning(null);
    const validExtensions = ['.pdf', '.txt', '.md', '.markdown'];
    const addedList = Array.from(files);

    const validFiles: File[] = [];
    for (const file of addedList) {
      const fileName = file.name.toLowerCase();
      const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

      if (!isValid) {
        setFileValidationWarning(
          `"${file.name}" is not supported. Please use PDF (.pdf), Plain Text (.txt), or Markdown (.md) files.`
        );
        continue;
      }

      if (fileName.endsWith('.pdf') && file.size > 20 * 1024 * 1024) {
        setFileValidationWarning(`"${file.name}" is larger than 20MB. Please use files under 20MB.`);
        continue;
      }

      if (!fileName.endsWith('.pdf') && file.size > 5 * 1024 * 1024) {
        setFileValidationWarning(`"${file.name}" is larger than 5MB. Please use smaller text documents.`);
        continue;
      }

      // Avoid duplicates by name and size
      if (!selectedFiles.some((f) => f.name === file.name && f.size === file.size)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setFileValidationWarning(null);
  };

  const handleBuildCourse = async () => {
    if (selectedFiles.length === 0) return;

    setIsReadingFiles(true);
    setFileValidationWarning(null);

    try {
      const parsedItems: UploadedFileItem[] = await Promise.all(
        selectedFiles.map((file) => {
          return new Promise<UploadedFileItem>((resolve, reject) => {
            const isPdf = file.name.toLowerCase().endsWith('.pdf');
            const reader = new FileReader();

            if (isPdf) {
              reader.onload = () => {
                const result = reader.result as string;
                const base64 = result.split(',')[1] || result;
                resolve({
                  fileName: file.name,
                  fileType: 'application/pdf',
                  fileSize: file.size,
                  pdfBase64: base64,
                });
              };
              reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
              reader.readAsDataURL(file);
            } else {
              reader.onload = () => {
                const text = reader.result as string;
                resolve({
                  fileName: file.name,
                  fileType: file.type || 'text/plain',
                  fileSize: file.size,
                  documentText: text,
                });
              };
              reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
              reader.readAsText(file);
            }
          });
        })
      );

      setIsReadingFiles(false);

      if (parsedItems.length === 1) {
        // Single document
        const single = parsedItems[0];
        onStartCourse({
          fileName: single.fileName,
          fileType: single.fileType,
          documentText: single.documentText,
          pdfBase64: single.pdfBase64,
          files: parsedItems,
        });
      } else {
        // Multiple documents
        const combinedTitle = parsedItems.map((f) => f.fileName.replace(/\.[^/.]+$/, '')).join(' + ');
        onStartCourse({
          fileName: combinedTitle,
          fileType: 'multipart/study-documents',
          documentText: parsedItems
            .map((f) => `=== DOCUMENT: ${f.fileName} ===\n${f.documentText || ''}`)
            .join('\n\n'),
          files: parsedItems,
        });
      }
    } catch (err: any) {
      setIsReadingFiles(false);
      setFileValidationWarning(err.message || 'Could not read document files. Please try again.');
    }
  };

  const handleSelectSample = (sample: SampleDoc) => {
    setSelectedFiles([]);
    setFileValidationWarning(null);
    onStartCourse({
      fileName: `${sample.name}.${sample.extension}`,
      fileType: sample.type,
      documentText: sample.content,
      files: [
        {
          fileName: `${sample.name}.${sample.extension}`,
          fileType: sample.type,
          documentText: sample.content,
          fileSize: sample.content.length,
        },
      ],
    });
  };

  const totalBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div
      data-testid="upload-screen"
      className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Intro Heading with normal font, animated gradient on Greetings, and subheading */}
        <div className="text-center space-y-3">
          {/* Greetings Heading with 3D website-grade ease-in and Memo gliding around it */}
          <div className="relative inline-block max-w-full my-3 sm:my-5 py-2 sm:py-3 px-4 sm:px-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.15] greetings-3d-entrance select-none min-h-[4rem] sm:min-h-[5.5rem] lg:min-h-[7rem] flex items-center justify-center">
              <span className="heading-gradient-animated inline-block font-normal pb-1">
                Greetings
              </span>
            </h1>

            {/* Memo 3D Companion gliding around Greetings and settling gracefully */}
            <div
              className={`absolute -top-3 -right-12 sm:-top-5 sm:-right-16 pointer-events-auto z-20 transition-all ${
                isMemoFlightSettled ? 'memo-orbit-settled' : 'memo-orbit-flight'
              }`}
              style={{ width: '110px', height: '125px' }}
              title="Memo · Your 3D Study Companion (Tap to cheer!)"
              onClick={() => {
                playCalmChime(true);
                setMemoGreetingMood('celebrate');
                setTimeout(() => setMemoGreetingMood('idle'), 2500);
              }}
            >
              <div className="w-[110px] h-[125px] cursor-pointer relative group">
                <MemoThreeCanvas
                  size="compact"
                  mood={memoGreetingMood}
                  interactive={false}
                  soundEnabled={true}
                />
                {isMemoFlightSettled && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-[10px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 shadow-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Hi! Tap me
                  </div>
                )}
              </div>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-normal text-[#3A3F4F] dark:text-[#F1F3F7] tracking-tight leading-snug">
            What would you like to learn today?
          </h2>

          {/* Dynamic rotating body contents with tips, tricks, and Did you know facts (no em dashes) */}
          <div className="max-w-xl mx-auto pt-1">
            <div
              className={`min-h-[56px] flex flex-col items-center justify-center transition-opacity duration-300 ${
                isSubFade ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-semibold mb-1.5 shadow-2xs">
                <Lightbulb className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{HOME_ROTATING_MESSAGES[currentSubtitleIndex].label}</span>
              </div>
              <p className="text-[#5F6573] dark:text-[#A6ACB9] text-sm sm:text-base leading-relaxed text-center px-4">
                {HOME_ROTATING_MESSAGES[currentSubtitleIndex].text}
              </p>
            </div>

            {/* Subtle pagination dots & manual navigation controls */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSubFade(false);
                  setTimeout(() => {
                    setCurrentSubtitleIndex((prev) =>
                      prev === 0 ? HOME_ROTATING_MESSAGES.length - 1 : prev - 1
                    );
                    setIsSubFade(true);
                  }, 180);
                }}
                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                title="Previous tip"
                aria-label="Previous tip"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                {HOME_ROTATING_MESSAGES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => {
                      setIsSubFade(false);
                      setTimeout(() => {
                        setCurrentSubtitleIndex(dotIdx);
                        setIsSubFade(true);
                      }, 180);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentSubtitleIndex === dotIdx
                        ? 'w-5 bg-[#1A6EF0]'
                        : 'w-1.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
                    }`}
                    title={`Go to item ${dotIdx + 1}`}
                    aria-label={`Go to item ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSubFade(false);
                  setTimeout(() => {
                    setCurrentSubtitleIndex((prev) => (prev + 1) % HOME_ROTATING_MESSAGES.length);
                    setIsSubFade(true);
                  }, 180);
                }}
                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                title="Next tip"
                aria-label="Next tip"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Upload Box Container */}
        <div className="bg-[#F9FAFC] dark:bg-[#1A1E27] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-9 space-y-6">
          {/* INFORMATIVE MULTI-STAGE LOADING SCREEN */}
          {isProcessing || isReadingFiles ? (
            <div className="py-6 px-2 sm:px-4 space-y-6">
              {/* Top 3D Memo Canvas */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center relative">
                <MemoThreeCanvas
                  size="medium"
                  mood="thinking"
                  interactive={true}
                  soundEnabled={false}
                />
              </div>

              {/* Informative Header & Dynamic Step Text */}
              <div className="text-center space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Crafting Your Study Course
                </h3>
                <p className="text-sm font-semibold text-[#1A6EF0] dark:text-[#64B5F6] animate-pulse">
                  {progressStep || 'Reading and de-noising document contents...'}
                </p>
                <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9] max-w-md mx-auto">
                  Memo is preparing Lesson 1 first so you can begin reading and learning with zero delay.
                </p>
              </div>

              {/* Clean, Honest Curriculum Progress State */}
              <div className="bg-white/80 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 sm:p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  <span className="uppercase tracking-wider">Curriculum Pipeline</span>
                  <span className="tabular-nums font-mono text-[#1A6EF0] dark:text-[#64B5F6]">
                    Step {activeStageIndex + 1} of {stages.length}
                  </span>
                </div>

                {/* Honest Linear Progress Bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1A6EF0] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.round(((activeStageIndex + 0.5) / stages.length) * 100)}%` }}
                  />
                </div>

                {/* Stages List: collapsed completed details by default */}
                <div className="space-y-2 pt-1">
                  {stages.map((stg, sIndex) => {
                    const isDone = sIndex < activeStageIndex;
                    const isCurrent = sIndex === activeStageIndex;
                    const isPending = sIndex > activeStageIndex;

                    return (
                      <div
                        key={stg.id}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-blue-50/70 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800 shadow-2xs'
                            : isDone
                            ? 'bg-zinc-50/50 dark:bg-zinc-800/30 border border-transparent opacity-75'
                            : 'opacity-40'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full bg-[#1A6EF0] text-white flex items-center justify-center animate-spin">
                              <RefreshCw className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                              {sIndex + 1}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-semibold ${
                                isCurrent
                                  ? 'text-[#1A6EF0] dark:text-blue-300'
                                  : isDone
                                  ? 'text-zinc-700 dark:text-zinc-300'
                                  : 'text-zinc-400 dark:text-zinc-500'
                              }`}
                            >
                              {stg.title}
                            </span>
                            {isDone && (
                              <span className="text-[10px] text-blue-700 dark:text-blue-400 font-medium">
                                Ready
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[10px] text-[#006A4E] dark:text-emerald-300 font-medium animate-pulse">
                                Working...
                              </span>
                            )}
                          </div>
                          {/* Collapse completed stage descriptions to reduce cognitive clutter */}
                          {isCurrent && (
                            <p className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9] leading-snug mt-0.5">
                              {stg.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : errorMessage ? (
            /* Error State with Retry Button */
            <div className="py-8 px-4 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#3A3F4F] dark:text-[#F1F3F7]">
                  Something interrupted this step
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6573] dark:text-[#A6ACB9] max-w-sm mx-auto">
                  {errorMessage}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A6EF0] text-white font-medium hover:opacity-95 transition-opacity cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry step</span>
                </button>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-[#3A3F4F] dark:text-[#F1F3F7] font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm cursor-pointer"
                >
                  Choose another file
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD / MULTI-UPLOAD UPLOAD SCREEN */
            <>
              {/* Hidden file input with multiple support */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.md,.markdown"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFilesAdded(e.target.files);
                  }
                  e.target.value = '';
                }}
              />

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFilesAdded(e.dataTransfer.files);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-[#1A6EF0] bg-[#1A6EF0]/5 dark:bg-[#1A6EF0]/10 scale-[1.01]'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white/70 dark:bg-zinc-900/40'
                }`}
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center justify-center mb-3.5 shadow-2xs">
                  <Upload className="w-6 h-6 text-[#1A6EF0]" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-[#3A3F4F] dark:text-[#F1F3F7]">
                    {selectedFiles.length > 0
                      ? 'Click or drop to add more documents'
                      : 'Click to select documents or drag & drop here'}
                  </p>
                  <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                    Supports multiple files · PDF, TXT, or Markdown (MD)
                  </p>
                </div>
              </div>

              {fileValidationWarning && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileValidationWarning}</span>
                </div>
              )}

              {/* Selected Files Queue Manager */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#3A3F4F] dark:text-[#F1F3F7]">
                        Selected Documents ({selectedFiles.length})
                      </span>
                      <span className="text-[11px] text-zinc-500 tabular-nums">
                        · {(totalBytes / 1024).toFixed(1)} KB total
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A6EF0] hover:underline cursor-pointer"
                      >
                        <FilePlus className="w-3.5 h-3.5" />
                        <span>Add another</span>
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-xs font-semibold text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedFiles.map((file, idx) => {
                      const isPdf = file.name.toLowerCase().endsWith('.pdf');
                      return (
                        <div
                          key={`${file.name}-${idx}`}
                          className="p-3 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-[#1A6EF0]/10 text-[#1A6EF0] flex items-center justify-center shrink-0">
                              <FileText className="w-4.5 h-4.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] truncate">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-[#5F6573] dark:text-[#A6ACB9]">
                                <span className="font-mono uppercase">
                                  {isPdf ? 'PDF Document' : 'Text / Markdown'}
                                </span>
                                <span>•</span>
                                <span className="tabular-nums">{(file.size / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#B5F55A] text-[#1F410B] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                              title="Remove file"
                              aria-label="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Single Clear Main Action Button */}
              <button
                disabled={selectedFiles.length === 0}
                onClick={handleBuildCourse}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm ${
                  selectedFiles.length > 0
                    ? 'bg-[#1A6EF0] text-white hover:bg-[#1558C4] active:scale-[0.99] cursor-pointer'
                    : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                }`}
              >
                <span>
                  {selectedFiles.length > 1
                    ? `Build course from ${selectedFiles.length} documents`
                    : 'Build my course'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Quick Sample Documents */}
        {!isProcessing && !isReadingFiles && (
          <div className="space-y-3 pt-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#5F6573] dark:text-[#A6ACB9]">
              Or try with a sample document
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_DOCUMENTS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSelectSample(sample)}
                  className="text-left p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-[#F9FAFC] dark:bg-[#1A1E27] hover:border-[#1A6EF0] transition-all group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      .{sample.extension}
                    </span>
                    <FileText className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#1A6EF0] transition-colors" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] line-clamp-1 group-hover:text-[#1A6EF0] transition-colors">
                    {sample.name}
                  </h4>
                  <p className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9] line-clamp-2 mt-1">
                    {sample.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Meet Memo 3D Study Companion Card with Quick Feedback Shortcut */}
            <div className="mt-6 p-5 rounded-3xl bg-white/70 dark:bg-[#1A1E27]/70 border border-zinc-200/80 dark:border-zinc-800 shadow-xs backdrop-blur-xs flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-[#22D08B]/60">
              <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                <MemoThreeCanvas
                  size="compact"
                  mood="idle"
                  interactive={true}
                  soundEnabled={true}
                />
              </div>

              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="font-semibold text-sm text-[#3A3F4F] dark:text-[#F1F3F7]">
                    Meet Memo · 3D Study Companion
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-[#22D08B] animate-pulse" />
                </div>
                <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9] leading-relaxed">
                  A cute minimal white pen with futuristic green-to-blue lighting. Ask doubts anytime grounded strictly in your document, configure your pace, and share feedback anytime.
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                {onOpenMemo && (
                  <button
                    type="button"
                    onClick={onOpenMemo}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1A6EF0] hover:bg-[#1558C4] text-white transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Ask Memo</span>
                  </button>
                )}
                {onOpenFeedback && (
                  <button
                    type="button"
                    onClick={onOpenFeedback}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Feedback</span>
                  </button>
                )}
                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] border border-zinc-200 dark:border-zinc-700 hover:border-[#1A6EF0] transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Settings</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
