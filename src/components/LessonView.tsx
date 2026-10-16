/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Quote,
  Layers,
  RefreshCw,
  GitCommit,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  BookOpen
} from 'lucide-react';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { Section, Question, QuizAnswer } from '../types.ts';

interface LessonViewProps {
  section: Section;
  totalSections: number;
  onPreviousSection: () => void;
  onNextSection: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  isCompleted: boolean;
  onMarkSectionCompleted: (index: number) => void;
  sectionAnswers: Record<string, QuizAnswer>;
  onAnswerQuestion: (question: Question, selectedAnswer: string) => void;
  onFetchPlainWords: (sectionIndex: number) => Promise<void>;
  isFetchingPlainWords: boolean;
}

export const LessonView: React.FC<LessonViewProps> = ({
  section,
  totalSections,
  onPreviousSection,
  onNextSection,
  hasPrevious,
  hasNext,
  isCompleted,
  onMarkSectionCompleted,
  sectionAnswers,
  onAnswerQuestion,
  onFetchPlainWords,
  isFetchingPlainWords,
}) => {
  const { fontSizeClass } = useThemeAndText();

  // Progressive Chunk State: start at chunk 0, student clicks "Continue" to reveal next chunk
  const [visibleChunkCount, setVisibleChunkCount] = useState(1);
  const [showSimplerWording, setShowSimplerWording] = useState(false);
  const [showOriginalText, setShowOriginalText] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

  // Reset chunk count when section changes
  useEffect(() => {
    setVisibleChunkCount(1);
    setShowSimplerWording(false);
    setShowOriginalText(false);
    setExpandedExplanations({});
  }, [section.sectionIndex]);

  const lesson = section.lesson;
  const chunks = lesson?.chunks || [];
  const keyPoints = lesson?.keyPoints || [];
  const sectionQuestions = lesson?.questions || [];
  const steps = lesson?.steps || [];
  const glossary = lesson?.glossary || [];

  const allChunksRevealed = visibleChunkCount >= chunks.length;

  const handleContinueChunk = () => {
    if (visibleChunkCount < chunks.length) {
      setVisibleChunkCount((prev) => prev + 1);
    }
  };

  const handleTogglePlainWords = async () => {
    if (!showSimplerWording && !lesson?.plainWords) {
      await onFetchPlainWords(section.sectionIndex);
    }
    setShowSimplerWording(!showSimplerWording);
  };

  const toggleExplanation = (questionId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  return (
    <div data-testid="lesson-view" className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Section Header */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1A6EF0]/10 text-[#1A6EF0] dark:bg-[#1A6EF0]/20">
              Lesson {section.sectionIndex + 1} of {totalSections}
            </span>
            <span className="border border-zinc-400/40 text-[9px] tracking-widest font-semibold uppercase px-2 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
              STUDY DRAFT
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#A8C7FA] text-[#0A387E]">
                <Check className="w-3 h-3" /> Finished
              </span>
            )}
          </div>

          {/* Simpler wording button */}
          <button
            onClick={handleTogglePlainWords}
            disabled={isFetchingPlainWords}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
              showSimplerWording
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700'
                : 'bg-white dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/60'
            }`}
            title="Read simpler wording without outside facts"
          >
            {isFetchingPlainWords ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-500" />
            )}
            <span>{showSimplerWording ? 'View Study Chunks' : 'Plain words'}</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-light text-[#3A3F4F] dark:text-[#F1F3F7] tracking-tight">
          {section.title}
        </h1>

        {lesson?.intro && (
          <p className="text-[#5F6573] dark:text-[#A6ACB9] text-sm sm:text-base leading-relaxed">
            {lesson.intro}
          </p>
        )}
      </div>

      {/* Simpler wording active notice */}
      {showSimplerWording && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
              Simpler wording
            </span>
            <span className="border border-amber-400/40 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded text-amber-800 dark:text-amber-300">
              STUDY DRAFT
            </span>
          </div>
          <p className={`text-amber-950 dark:text-amber-100 leading-relaxed whitespace-pre-line ${fontSizeClass}`}>
            {lesson?.plainWords || 'Loading simpler wording...'}
          </p>
        </div>
      )}

      {/* Progressive Study Chunks: ONE small chunk group at a time */}
      {!showSimplerWording && (
        <section className="space-y-6" aria-label="Study chunks">
          {chunks.slice(0, visibleChunkCount).map((chunk, cIdx) => (
            <div
              key={chunk.id || cIdx}
              className="p-6 sm:p-7 rounded-3xl bg-[#F9FAFC] dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2 animate-fadeIn"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A6EF0]">
                  {chunk.title}
                </span>
                <span className="text-[10px] text-[#5F6573] dark:text-[#A6ACB9]">
                  Part {cIdx + 1} of {chunks.length}
                </span>
              </div>
              <p className={`text-[#3A3F4F] dark:text-[#F1F3F7] leading-relaxed ${fontSizeClass}`}>
                {chunk.content}
              </p>
            </div>
          ))}

          {/* Continue button if more chunks remain */}
          {!allChunksRevealed && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleContinueChunk}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A6EF0] text-white font-semibold hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-sm text-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Structured steps, timelines, or comparisons if present */}
      {allChunksRevealed && steps && steps.length > 0 && (
        <section className="space-y-4 pt-2 animate-fadeIn" aria-label="Steps and comparisons">
          {steps.map((st, sIdx) => (
            <div
              key={sIdx}
              className="p-6 rounded-3xl bg-[#F9FAFC] dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 space-y-4"
            >
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-[#1A6EF0]" />
                <h3 className="font-semibold text-sm sm:text-base text-[#3A3F4F] dark:text-[#F1F3F7]">
                  {st.title}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {st.type}
                </span>
              </div>

              {st.type === 'comparison' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {st.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
                    >
                      <span className="text-xs font-bold uppercase text-[#5F6573] dark:text-[#A6ACB9] block mb-1">
                        {item.label}
                      </span>
                      <p className={`text-[#3A3F4F] dark:text-[#F1F3F7] ${fontSizeClass}`}>
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <ol className="space-y-3 relative border-l-2 border-zinc-300 dark:border-zinc-700 ml-3 pl-4">
                  {st.items.map((item, iIdx) => (
                    <li key={iIdx} className="relative">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[#1A6EF0]" />
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                        <span className="font-bold text-xs uppercase text-[#5F6573] dark:text-[#A6ACB9] block mb-0.5">
                          {item.label}
                        </span>
                        <span className={`text-[#3A3F4F] dark:text-[#F1F3F7] ${fontSizeClass}`}>
                          {item.detail}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Key Points Box: 3 to 4 points at the end of each section */}
      {allChunksRevealed && keyPoints.length > 0 && (
        <section
          className="p-6 sm:p-7 rounded-3xl bg-[#F9FAFC] dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 space-y-4 animate-fadeIn"
          aria-label="Section key points"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22D08B]" />
              <h3 className="text-base sm:text-lg font-medium text-[#3A3F4F] dark:text-[#F1F3F7]">
                Key Points
              </h3>
            </div>
            <span className="border border-zinc-400/40 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded text-zinc-500">
              STUDY DRAFT
            </span>
          </div>

          <ul className="space-y-2.5">
            {keyPoints.map((point, kIdx) => (
              <li key={kIdx} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A6EF0] mt-2.5 shrink-0" />
                <p className={`text-[#3A3F4F] dark:text-[#F1F3F7] leading-relaxed ${fontSizeClass}`}>
                  {point}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Check Yourself Section Quiz */}
      {allChunksRevealed && sectionQuestions.length > 0 && (
        <section
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-zinc-200/80 dark:border-zinc-800 space-y-6 shadow-sm animate-fadeIn"
          aria-label="Check yourself quiz"
        >
          <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-xl font-medium text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1A6EF0]" />
                <span>Check yourself</span>
              </h3>
              <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9] mt-0.5">
                Instant feedback. Learning is the priority—answers and quotes are grounded directly in the text.
              </p>
            </div>
            <span className="border border-zinc-400/40 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded text-zinc-500">
              STUDY DRAFT
            </span>
          </div>

          <div className="space-y-8">
            {sectionQuestions.map((q, qIdx) => {
              const currentAnswer = sectionAnswers[q.id];
              const isAnswered = !!currentAnswer;
              const isCorrect = currentAnswer?.isCorrect;
              const showQuote = expandedExplanations[q.id] || (isAnswered && !isCorrect);

              return (
                <div
                  key={q.id || qIdx}
                  className="space-y-4 pt-2 border-b border-zinc-100 dark:border-zinc-800/80 last:border-b-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5F6573] dark:text-[#A6ACB9]">
                      Question {qIdx + 1} ({q.type.replace('-', ' ')})
                    </span>
                    {isAnswered && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isCorrect
                            ? 'bg-[#B5F55A] text-[#1F410B]'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Correct
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" /> Missed
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <p className={`font-medium text-[#3A3F4F] dark:text-[#F1F3F7] ${fontSizeClass}`}>
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = currentAnswer?.selectedAnswer === opt;
                      const isTargetCorrect = opt === q.correctAnswer;

                      let btnStyle =
                        'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 bg-[#F9FAFC] dark:bg-zinc-800/40 text-[#3A3F4F] dark:text-[#F1F3F7]';

                      if (isAnswered) {
                        if (isSelected && isCorrect) {
                          btnStyle =
                            'border-[#22D08B] bg-[#B5F55A]/30 text-[#1F410B] dark:text-[#B5F55A] font-semibold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle =
                            'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/60 dark:text-red-200';
                        } else if (isTargetCorrect) {
                          btnStyle =
                            'border-[#22D08B]/60 bg-[#B5F55A]/15 text-[#1F410B] dark:text-[#B5F55A]';
                        } else {
                          btnStyle =
                            'border-zinc-200 dark:border-zinc-800 opacity-60 text-zinc-400';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => onAnswerQuestion(q, opt)}
                          className={`text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && isSelected && (
                            <span>{isCorrect ? <Check className="w-4 h-4 text-[#22D08B]" /> : <X className="w-4 h-4 text-red-600" />}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* "Why?" / Exact Quote disclosure */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs font-semibold text-[#1A6EF0] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Quote className="w-3.5 h-3.5" />
                      <span>{showQuote ? 'Hide source quote' : 'Why? (Show exact quote)'}</span>
                      {showQuote ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showQuote && (
                      <div className="mt-2.5 p-4 rounded-2xl bg-[#F9FAFC] dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 animate-fadeIn">
                        <div className="text-xs font-semibold text-[#5F6573] dark:text-[#A6ACB9]">
                          Exact quote from "{section.title}":
                        </div>
                        <blockquote className="text-xs sm:text-sm text-[#3A3F4F] dark:text-[#F1F3F7] italic border-l-2 border-[#1A6EF0] pl-3 py-0.5">
                          "{q.sourceQuote}"
                        </blockquote>
                        <div className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9] pt-0.5">
                          Answer: <strong className="text-[#3A3F4F] dark:text-[#F1F3F7]">{q.correctAnswer}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* "Show original text" toggle on each section, closed by default */}
      <section className="pt-2">
        <button
          onClick={() => setShowOriginalText(!showOriginalText)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#1A6EF0] transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>{showOriginalText ? 'Hide original text' : 'Show original text'}</span>
          {showOriginalText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showOriginalText && (
          <div className="mt-3 p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2 animate-fadeIn">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              Cleaned Original Document Text
            </span>
            <div className={`text-[#3A3F4F] dark:text-[#F1F3F7] leading-relaxed whitespace-pre-line ${fontSizeClass}`}>
              {section.content}
            </div>
          </div>
        )}
      </section>

      {/* Bottom Navigation: Previous, Next, Mark Done */}
      <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onPreviousSection}
          disabled={!hasPrevious}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-[#3A3F4F] dark:text-[#F1F3F7] font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Lesson</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onMarkSectionCompleted(section.sectionIndex)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              isCompleted
                ? 'bg-[#A8C7FA] text-[#0A387E]'
                : 'bg-zinc-200 dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Finished Lesson' : 'Mark Lesson Done'}</span>
          </button>

          <button
            onClick={onNextSection}
            disabled={!hasNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A6EF0] text-white font-semibold hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
