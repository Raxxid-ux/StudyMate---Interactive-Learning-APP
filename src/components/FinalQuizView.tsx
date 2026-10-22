/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Award, RefreshCw, Check, X, Quote, ChevronDown, ChevronUp, ArrowRight } from './icons.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { CourseData, Question } from '../types.ts';

interface FinalQuizViewProps {
  course: CourseData;
}

export const FinalQuizView: React.FC<FinalQuizViewProps> = ({ course }) => {
  const { fontSizeClass } = useThemeAndText();
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
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
    setUserAnswers({});
    setSubmitted(false);
    setExpandedQuotes({});
  };

  const toggleQuote = (id: string) => {
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (allQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#1A6EF0]/10 text-[#1A6EF0] flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-light text-[#3A3F4F] dark:text-[#F1F3F7]">
          Final Review Quiz Preparing
        </h2>
        <p className="text-[#5F6573] dark:text-[#A6ACB9] text-sm max-w-md mx-auto leading-relaxed">
          Questions from all lessons will compile here as lessons finish building in the background.
        </p>
      </div>
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const score = calculateScore();

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-36 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-light text-[#3A3F4F] dark:text-[#F1F3F7] tracking-tight">
              Final Review Quiz
            </h1>
            <span className="border border-zinc-400/40 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded text-zinc-500">
              STUDY DRAFT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6573] dark:text-[#A6ACB9] mt-1">
            Check your understanding across the entire course.
          </p>
        </div>

        {!submitted && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7]">
            {answeredCount} of {allQuestions.length} Answered
          </span>
        )}
      </div>

      {/* Submitted Score Summary Banner */}
      {submitted && (
        <div className="p-8 rounded-3xl bg-[#F9FAFC] dark:bg-[#1A1E27] border-2 border-[#1A6EF0] shadow-sm space-y-4 text-center animate-fadeIn">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A6EF0]/10 text-[#1A6EF0]">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-light text-[#3A3F4F] dark:text-[#F1F3F7]">
              {score.correct} / {score.total} ({score.percentage}%)
            </h2>
            <p className="text-sm text-[#5F6573] dark:text-[#A6ACB9] max-w-md mx-auto leading-relaxed">
              {score.percentage >= 80
                ? 'Great job! You have understood the key ideas in this document.'
                : 'Good effort! Review the exact source quotes below or practice in Review Mistakes.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1A6EF0] text-white font-semibold hover:opacity-95 transition-opacity cursor-pointer text-sm shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {allQuestions.map((q, idx) => {
          const selected = userAnswers[q.id];
          const isRight = selected === q.correctAnswer;
          const isExpanded = expandedQuotes[q.id];

          return (
            <div
              key={q.id || idx}
              className="p-7 rounded-3xl bg-[#F9FAFC] dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Question {idx + 1} of {allQuestions.length} ({q.type.replace('-', ' ')})
                </span>
                <span className="truncate max-w-xs">{q.sectionTitle}</span>
              </div>

              <h3 className={`font-medium text-[#3A3F4F] dark:text-[#F1F3F7] ${fontSizeClass}`}>
                {q.question}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, oIdx) => {
                  const isOptionSelected = selected === opt;
                  const isCorrectTarget = opt === q.correctAnswer;

                  let style =
                    'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 text-[#3A3F4F] dark:text-[#F1F3F7] hover:border-zinc-400';

                  if (submitted) {
                    if (isOptionSelected && isRight) {
                      style =
                        'border-[#22D08B] bg-[#B5F55A]/30 text-[#1F410B] dark:text-[#B5F55A] font-semibold';
                    } else if (isOptionSelected && !isRight) {
                      style =
                        'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/60 dark:text-red-200';
                    } else if (isCorrectTarget) {
                      style =
                        'border-[#22D08B]/60 bg-[#B5F55A]/15 text-[#1F410B] dark:text-[#B5F55A]';
                    } else {
                      style = 'border-zinc-200 dark:border-zinc-800 opacity-60 text-zinc-400';
                    }
                  } else if (isOptionSelected) {
                    style =
                      'border-[#1A6EF0] bg-[#1A6EF0] text-white font-semibold shadow-xs';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer disabled:cursor-default ${style}`}
                    >
                      <span>{opt}</span>
                      {submitted && isOptionSelected && (
                        <span>
                          {isRight ? (
                            <Check className="w-4 h-4 text-[#22D08B]" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submitted Details & Exact Quote */}
              {submitted && (
                <div className="pt-2">
                  <button
                    onClick={() => toggleQuote(q.id)}
                    className="text-xs font-semibold text-[#1A6EF0] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'Hide source quote' : 'Show source quote & proof'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-xs sm:text-sm text-[#3A3F4F] dark:text-[#F1F3F7] italic space-y-1">
                      <p>"{q.sourceQuote}"</p>
                      <p className="text-[11px] not-italic text-[#5F6573] dark:text-[#A6ACB9]">
                        Exact citation from: <strong>{q.sectionTitle}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Finish Button */}
      {!submitted && (
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={answeredCount === 0}
            className="h-11 px-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A6EF0] text-white font-semibold text-sm hover:bg-[#1558C4] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <span className="leading-none">Submit Final Quiz</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
};
