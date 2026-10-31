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
} from './icons.tsx';
import { SAMPLE_DOCUMENTS, type SampleDoc } from '../sampleDocuments.ts';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import { MemoThreeCanvas } from './MemoThreeCanvas.tsx';
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
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#1A6EF0]/30 bg-[#1A6EF0]/5 text-[10px] tracking-widest font-bold uppercase text-[#1A6EF0] dark:text-[#64B5F6]">
            <span>STUDYMATE · INTERACTIVE LEARNING</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight leading-tight">
            <span className="heading-gradient-animated inline-block font-normal">
              Greetings,
            </span>
          </h1>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-normal text-[#3A3F4F] dark:text-[#F1F3F7] tracking-tight leading-snug">
            What would you like to learn today?
          </h2>

          <p className="text-[#5F6573] dark:text-[#A6ACB9] text-sm sm:text-base max-w-lg mx-auto leading-relaxed pt-1">
            StudyMate turns single or multiple documents into a short, calm, easy study course with Memo, your 3D interactive companion.
          </p>
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

              {/* Informative Progress Stages Roadmap */}
              <div className="bg-white/80 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 sm:p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <span className="uppercase tracking-wider">Curriculum Pipeline</span>
                  <span className="tabular-nums font-mono text-[#1A6EF0] dark:text-[#64B5F6]">
                    Stage {activeStageIndex + 1} of {stages.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stages.map((stg, sIndex) => {
                    const isDone = sIndex < activeStageIndex;
                    const isCurrent = sIndex === activeStageIndex;
                    const isPending = sIndex > activeStageIndex;

                    return (
                      <div
                        key={stg.id}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-[#1A6EF0]/5 dark:bg-[#1A6EF0]/10 border border-[#1A6EF0]/30 shadow-2xs'
                            : isDone
                            ? 'opacity-85'
                            : 'opacity-40'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full bg-[#1A6EF0] text-white flex items-center justify-center animate-spin">
                              <RefreshCw className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                              {sIndex + 1}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? 'text-[#1A6EF0] dark:text-[#64B5F6]'
                                  : isDone
                                  ? 'text-zinc-800 dark:text-zinc-200'
                                  : 'text-zinc-500 dark:text-zinc-400'
                              }`}
                            >
                              {stg.title}
                            </span>
                            {isDone && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                Complete
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[10px] text-[#1A6EF0] dark:text-[#64B5F6] font-semibold animate-pulse">
                                Processing...
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9] leading-snug mt-0.5">
                            {stg.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ROTATING MOTIVATIONAL QUOTES, TIPS & FACTS */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  theme === 'academia'
                    ? 'bg-[#F2ECE1] dark:bg-[#251F18] border-[#DECFC0] dark:border-[#3A3025]'
                    : 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-emerald-50/70 dark:from-slate-800/80 dark:to-slate-850/80 border-blue-200/60 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        activeMotivator.type === 'quote'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : activeMotivator.type === 'fact'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {activeMotivator.type === 'quote'
                        ? t.quoteLabel
                        : activeMotivator.type === 'fact'
                        ? t.factLabel
                        : t.tipLabel}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {motivatorIndex + 1} of {motivators.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setMotivatorIndex((p) => (p - 1 + motivators.length) % motivators.length)
                      }
                      className="w-6 h-6 rounded-lg bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-white flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                      title="Previous quote"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setMotivatorIndex((p) => (p + 1) % motivators.length)}
                      className="w-6 h-6 rounded-lg bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-white flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                      title="Next quote"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    theme === 'academia'
                      ? 'font-serif-scholar italic text-[#3E3227] dark:text-[#EAE0D3]'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {language === 'ml' ? activeMotivator.textMl : activeMotivator.text}
                </p>
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
