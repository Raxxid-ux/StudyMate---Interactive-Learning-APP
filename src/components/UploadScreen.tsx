/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, Sliders, Settings } from './icons.tsx';
import { SAMPLE_DOCUMENTS, type SampleDoc } from '../sampleDocuments.ts';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import { MemoThreeCanvas } from './MemoThreeCanvas.tsx';

interface UploadScreenProps {
  onStartCourse: (docData: {
    fileName: string;
    fileType: string;
    documentText?: string;
    pdfBase64?: string;
  }) => void;
  isProcessing: boolean;
  progressStep: string;
  errorMessage: string | null;
  onRetry: () => void;
  onOpenMemo?: () => void;
  onOpenSettings?: () => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onStartCourse,
  isProcessing,
  progressStep,
  errorMessage,
  onRetry,
  onOpenMemo,
  onOpenSettings,
}) => {
  const { fontSizeClass } = useThemeAndText();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileValidationWarning, setFileValidationWarning] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (file: File) => {
    setFileValidationWarning(null);
    const validExtensions = ['.pdf', '.txt', '.md', '.markdown'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setFileValidationWarning('Please select a PDF (.pdf), Plain Text (.txt), or Markdown (.md) file.');
      return;
    }

    if (fileName.endsWith('.pdf') && file.size > 20 * 1024 * 1024) {
      setFileValidationWarning('This document is larger than 20MB. Please choose a smaller document under 20MB.');
      return;
    }

    if (!fileName.endsWith('.pdf') && file.size > 2 * 1024 * 1024) {
      setFileValidationWarning('This text file is unusually large (>2MB). Please select a file under 2MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleBuildCourse = async () => {
    if (!selectedFile) return;

    if (selectedFile.name.toLowerCase().endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        onStartCourse({
          fileName: selectedFile.name,
          fileType: 'application/pdf',
          pdfBase64: base64,
        });
      };
      reader.onerror = () => {
        setFileValidationWarning('Could not read the document file. Please try again.');
      };
      reader.readAsDataURL(selectedFile);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        onStartCourse({
          fileName: selectedFile.name,
          fileType: selectedFile.type || 'text/plain',
          documentText: text,
        });
      };
      reader.onerror = () => {
        setFileValidationWarning('Could not read file contents. Please try again.');
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSelectSample = (sample: SampleDoc) => {
    setSelectedFile(null);
    setFileValidationWarning(null);
    onStartCourse({
      fileName: `${sample.name}.${sample.extension}`,
      fileType: sample.type,
      documentText: sample.content,
    });
  };

  return (
    <div
      data-testid="upload-screen"
      className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-3xl mx-auto space-y-10">
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

          <p className="text-[#5F6573] dark:text-[#A6ACB9] text-base sm:text-lg max-w-md mx-auto leading-relaxed pt-1">
            StudyMate turns any document into a short, calm, easy study course with Memo, your 3D interactive companion.
          </p>
        </div>

        {/* Upload Box Container */}
        <div className="bg-[#F9FAFC] dark:bg-[#1A1E27] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-10 space-y-6">
          {/* Processing State with live 3D Memo */}
          {isProcessing ? (
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-48 h-48 mx-auto flex items-center justify-center relative">
                <MemoThreeCanvas
                  size="medium"
                  mood="thinking"
                  interactive={true}
                  soundEnabled={false}
                />
              </div>

              <div className="space-y-2">
                <p className="text-base font-semibold text-[#5CC83A]">
                  {progressStep || 'Reading your document...'}
                </p>
                <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9] max-w-sm mx-auto leading-relaxed">
                  Keeping things short, simple, and calm. You can begin learning as soon as lesson 1 is ready.
                </p>
              </div>

              <div className="w-full max-w-xs mx-auto bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1A6EF0] h-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full" />
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
                  onClick={() => setSelectedFile(null)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-[#3A3F4F] dark:text-[#F1F3F7] font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm cursor-pointer"
                >
                  Choose another file
                </button>
              </div>
            </div>
          ) : (
            /* Standard Upload Screen: one box and one button */
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.markdown"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelection(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelection(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-[#1A6EF0] bg-[#1A6EF0]/5 dark:bg-[#1A6EF0]/10'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white/60 dark:bg-zinc-900/40'
                }`}
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center justify-center mb-4 shadow-xs">
                  <Upload className="w-6 h-6 text-[#1A6EF0]" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-base font-medium text-[#3A3F4F] dark:text-[#F1F3F7]">
                    {selectedFile ? 'Change selected file' : 'Click to pick a file or drop it here'}
                  </p>
                  <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                    PDF, TXT, or Markdown (MD)
                  </p>
                </div>
              </div>

              {fileValidationWarning && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileValidationWarning}</span>
                </div>
              )}

              {selectedFile && (
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-xl bg-[#1A6EF0]/10 text-[#1A6EF0] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#B5F55A] text-[#1F410B] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </span>
                </div>
              )}

              {/* Single Clear Main Action Button */}
              <button
                disabled={!selectedFile}
                onClick={handleBuildCourse}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-sm ${
                  selectedFile
                    ? 'bg-[#1A6EF0] text-white hover:opacity-95 active:scale-[0.99] cursor-pointer'
                    : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                }`}
              >
                <span>Build my course</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Quick Sample Documents */}
        {!isProcessing && (
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

            {/* Meet Memo 3D Study Companion Card */}
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
                  A cute minimal white pen with futuristic green-to-blue lighting. Ask doubts anytime grounded strictly in your document, and configure your text size, theme, and calm study pace.
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
