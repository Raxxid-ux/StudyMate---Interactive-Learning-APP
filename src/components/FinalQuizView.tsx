/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Final Review Quiz
 * Redesigned with Material 3 step-by-step presentation:
 * - One question at a time by default to eliminate cognitive overwhelm
 * - "Question X of Y" with a calm linear progress bar
 * - Clear Back / Next controls and completion status
 * - Question navigator bar allowing direct jumps
 * - Final review screen with clear submission requirements and answer summary
 */

import React, { useState, useMemo } from 'react';
import {
  Award,
  RefreshCw,
  Check,
  X,
  Quote,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from './icons.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { CourseData, Question } from '../types.ts';
import { playCalmChime, playSoftTap } from '../utils/audioChimes.ts';

interface FinalQuizViewProps {
  course: CourseData;
}

export const FinalQuizView: React.FC<FinalQuizViewProps> = ({ course }) => {
  const { fontSizeClass, theme } = useThemeAndText();
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewStep, setShowReviewStep] = useState(false);
  const [showNavigator, setShowNavigator] = useState(true);
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});

  const allQuestions = useMemo(() => {
    const list: Question[] = [];
    course.sections.forEach((sec) => {
      if (sec.lesson?.questions) {
        list.push(...sec.lesson.questions);
      }
    });
    return list;
  }, [course]);

  const handleSelectOption = (questionId: string, option: string) => {
    if (submitted) return;
    playSoftTap(true);
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    allQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: allQuestions.length,
      percentage: allQuestions.length > 0 ? Math.round((correct / allQuestions.length) * 100) : 0,
    };
  };

  const handleRetry = () => {
    playSoftTap(true);
    setUserAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
    setShowReviewStep(false);
    setExpandedQuotes({});
  };

  const toggleQuote = (id: string) => {
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (allQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#006A4E]/10 dark:bg-emerald-950/40 text-[#006A4E] dark:text-emerald-400 flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Final Review Quiz Preparing
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
          Questions from all lessons will compile here as lessons finish building in the background.
        </p>
      </div>
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = allQuestions.length;
  const unansweredIndices = allQuestions
    .map((q, idx) => (userAnswers[q.id] ? null : idx))
    .filter((idx): idx is number => idx !== null);

  const currentQ = allQuestions[currentIndex] || allQuestions[0];
  const isCurrentAnswered = Boolean(userAnswers[currentQ?.id]);
  const score = calculateScore();

  // =========================================================================
  // SUBMITTED RESULTS VIEW
  // =========================================================================
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-36 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
        {/* Results Banner */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all text-center space-y-4 ${
            theme === 'academia'
              ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E2D6C5] dark:border-[#3E342B]'
              : 'bg-white dark:bg-[#1A1E27] border-emerald-200 dark:border-emerald-800 shadow-sm'
          }`}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#006A4E] dark:text-emerald-400">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400">
              Quiz Completed
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              {score.correct} / {score.total} ({score.percentage}%)
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed pt-1">
              {score.percentage >= 80
                ? 'Outstanding comprehension! You have mastered the core concepts from this document.'
                : 'Good effort! Review the questions and exact source proof below to reinforce key points.'}
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A6EF0] hover:bg-[#1558C4] text-white font-semibold cursor-pointer text-sm shadow-xs transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Answer Review & Source Proof
          </h3>

          {allQuestions.map((q, idx) => {
            const selected = userAnswers[q.id];
            const isRight = selected === q.correctAnswer;
            const isExpanded = expandedQuotes[q.id];

            return (
              <div
                key={q.id || idx}
                className={`p-5 sm:p-6 rounded-2xl border transition-all space-y-3 ${
                  isRight
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                    : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-[10px]">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isRight
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {isRight ? 'Correct' : 'Needs Review'}
                    </span>
                  </div>
                  <span className="truncate max-w-[200px] text-[11px]">{q.sectionTitle}</span>
                </div>

                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                  {q.question}
                </h4>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const isOptionSelected = selected === opt;
                    const isCorrectTarget = opt === q.correctAnswer;

                    let style = 'border-zinc-200 dark:border-zinc-800 text-zinc-400 bg-white/40 dark:bg-zinc-800/40';
                    if (isCorrectTarget) {
                      style = 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isOptionSelected && !isRight) {
                      style = 'border-rose-400 bg-rose-100/70 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200';
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${style}`}
                      >
                        <span>{opt}</span>
                        {isCorrectTarget && <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />}
                        {isOptionSelected && !isRight && <X className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Proof & Exact Citation */}
                {q.sourceQuote && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => toggleQuote(q.id)}
                      className="text-xs font-semibold text-[#006A4E] dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Quote className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide source quote' : 'Show citation proof'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3.5 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 italic space-y-1">
                        <p>"{q.sourceQuote}"</p>
                        <p className="text-[10px] not-italic text-zinc-500 dark:text-zinc-400">
                          Citation from lesson: <strong>{q.sectionTitle}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // REVIEW STEP (Before Submitting)
  // =========================================================================
  if (showReviewStep) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-36 sm:px-6 space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Review Before Submitting
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Ensure you have answered all questions before finalizing your score.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowReviewStep(false)}
            className="text-xs font-semibold text-[#006A4E] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Back to Quiz
          </button>
        </div>

        {/* Status card */}
        <div
          className={`p-5 rounded-2xl border ${
            unansweredIndices.length === 0
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {unansweredIndices.length === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
            )}
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {unansweredIndices.length === 0
                ? 'All questions answered!'
                : `${unansweredIndices.length} question${
                    unansweredIndices.length > 1 ? 's' : ''
                  } still unanswered`}
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
            {unansweredIndices.length === 0
              ? 'You are ready to submit your final review quiz.'
              : 'You can submit now, or tap any unanswered question below to fill it in first.'}
          </p>
        </div>

        {/* Question checklist */}
        <div className="space-y-2">
          {allQuestions.map((q, idx) => {
            const hasAns = Boolean(userAnswers[q.id]);
            return (
              <button
                key={q.id || idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowReviewStep(false);
                }}
                className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                  hasAns
                    ? 'bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                    : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 hover:border-amber-500'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      hasAns
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {q.question}
                  </span>
                </div>

                <div className="shrink-0 ml-3">
                  {hasAns ? (
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      Answered
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 underline">
                      Jump to question
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Submission Action */}
        <div className="pt-4 flex items-center justify-between gap-3 border-t border-zinc-200/80 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setShowReviewStep(false)}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Continue Editing
          </button>

          <button
            type="button"
            onClick={() => {
              playCalmChime(true);
              setSubmitted(true);
            }}
            disabled={answeredCount === 0}
            className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A6EF0] hover:bg-[#1558C4] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-40"
          >
            <span>Submit Final Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ONE QUESTION AT A TIME STEP-BY-STEP VIEW
  // =========================================================================
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-36 sm:px-6 space-y-6">
      {/* Header bar: Question X of Y + Answered summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A6EF0] dark:text-[#64B5F6] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-500">
              {currentQ.type.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 tabular-nums">
              {answeredCount}/{totalQuestions} answered
            </span>
            <button
              type="button"
              onClick={() => setShowReviewStep(true)}
              className="text-xs font-semibold text-[#1A6EF0] dark:text-[#64B5F6] hover:underline cursor-pointer"
            >
              Review All
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#1A6EF0] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Compact Question Jump Navigator */}
        {showNavigator && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 tabs-container no-scrollbar">
            {allQuestions.map((q, idx) => {
              const hasAns = Boolean(userAnswers[q.id]);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1A6EF0] text-white shadow-xs ring-2 ring-[#1A6EF0]/30'
                      : hasAns
                      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                  }`}
                  title={`Question ${idx + 1}${hasAns ? ' (Answered)' : ' (Unanswered)'}`}
                  aria-label={`Jump to question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Single Question Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-5 shadow-2xs ${
          theme === 'academia'
            ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E2D6C5] dark:border-[#3E342B]'
            : 'bg-white dark:bg-[#1A1E27] border-zinc-200/80 dark:border-zinc-800'
        }`}
      >
        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
          <span className="truncate max-w-sm">From Lesson: {currentQ.sectionTitle}</span>
          {isCurrentAnswered && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5" /> Selected
            </span>
          )}
        </div>

        <h3 className={`font-semibold text-zinc-900 dark:text-zinc-100 text-base sm:text-lg leading-snug ${fontSizeClass}`}>
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5 pt-1">
          {currentQ.options.map((opt, oIdx) => {
            const isSelected = userAnswers[currentQ.id] === opt;
            return (
              <button
                key={oIdx}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt)}
                className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between cursor-pointer min-h-[48px] ${
                  isSelected
                    ? 'border-[#006A4E] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:border-[#006A4E]/60 dark:hover:border-emerald-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'border-[#1A6EF0] bg-[#1A6EF0] text-white'
                        : 'border-zinc-300 dark:border-zinc-600 text-zinc-500'
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#1A6EF0] dark:text-blue-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls: Back / Next / Review */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          className="h-11 px-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs sm:text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/60 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((p) => Math.min(totalQuestions - 1, p + 1))}
              className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A6EF0] hover:bg-[#1558C4] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowReviewStep(true)}
              className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A6EF0] hover:bg-[#1558C4] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <span>Review & Submit</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
