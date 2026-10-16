/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Quote, Check, X, Sparkles } from 'lucide-react';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { MistakeRecord, Question } from '../types.ts';

interface ReviewMistakesViewProps {
  mistakes: MistakeRecord[];
  onCorrectMistake: (questionId: string) => void;
  onRecordMistakeAgain: (question: Question, wrongAnswer: string) => void;
  onJumpToSection: (sectionIndex: number) => void;
}

export const ReviewMistakesView: React.FC<ReviewMistakesViewProps> = ({
  mistakes,
  onCorrectMistake,
  onRecordMistakeAgain,
  onJumpToSection,
}) => {
  const { fontSizeClass } = useThemeAndText();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showQuotes, setShowQuotes] = useState<Record<string, boolean>>({});

  const handleSelectOption = (question: Question, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: option }));

    if (option === question.correctAnswer) {
      setTimeout(() => {
        onCorrectMistake(question.id);
      }, 700);
    } else {
      onRecordMistakeAgain(question, option);
    }
  };

  const toggleQuote = (id: string) => {
    setShowQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (mistakes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#B5F55A]/30 text-[#1F410B] dark:text-[#B5F55A] flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[#22D08B]" />
        </div>
        <h2 className="text-3xl font-light text-[#3A3F4F] dark:text-[#F1F3F7]">
          No mistakes to review
        </h2>
        <p className="text-[#5F6573] dark:text-[#A6ACB9] max-w-md mx-auto text-sm leading-relaxed">
          You've mastered all attempted questions so far. Any question you miss in a lesson quiz will appear here so you can try again calmly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 pb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-light text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center gap-2.5">
            <AlertCircle className="w-6 h-6 text-[#1A6EF0]" />
            <span>Review My Mistakes</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6573] dark:text-[#A6ACB9] mt-1">
            Re-attempt each question. Once answered correctly, it is removed from this list.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B5F55A] text-[#1F410B]">
          {mistakes.length} {mistakes.length === 1 ? 'question remaining' : 'questions remaining'}
        </span>
      </div>

      {/* Mistake Items */}
      <div className="space-y-6">
        {mistakes.map(({ question, studentAnswer }) => {
          const currentChoice = selectedAnswers[question.id] || studentAnswer;
          const isSolved = currentChoice === question.correctAnswer;
          const isQuoteOpen = showQuotes[question.id];

          return (
            <div
              key={question.id}
              className={`p-7 rounded-3xl border transition-all ${
                isSolved
                  ? 'bg-[#B5F55A]/15 border-[#22D08B]'
                  : 'bg-[#F9FAFC] dark:bg-[#1A1E27] border-zinc-200/80 dark:border-zinc-800 shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6573] dark:text-[#A6ACB9]">
                    From Lesson {question.sectionIndex + 1}:
                  </span>
                  <button
                    onClick={() => onJumpToSection(question.sectionIndex)}
                    className="text-xs font-semibold text-[#1A6EF0] hover:underline"
                  >
                    {question.sectionTitle}
                  </button>
                </div>
                {isSolved ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F410B] dark:text-[#B5F55A]">
                    <Check className="w-4 h-4 text-[#22D08B]" /> Solved! Removing...
                  </span>
                ) : (
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Previously answered: "{studentAnswer}"
                  </span>
                )}
              </div>

              <h3 className={`font-medium text-[#3A3F4F] dark:text-[#F1F3F7] mb-4 ${fontSizeClass}`}>
                {question.question}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {question.options.map((opt, oIdx) => {
                  const isSelected = currentChoice === opt;
                  const isRight = opt === question.correctAnswer;

                  let style =
                    'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 text-[#3A3F4F] dark:text-[#F1F3F7] hover:border-zinc-400';

                  if (isSelected) {
                    if (isRight) {
                      style =
                        'border-[#22D08B] bg-[#B5F55A]/30 text-[#1F410B] dark:text-[#B5F55A] font-semibold';
                    } else {
                      style =
                        'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/60 dark:text-red-200';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(question, opt)}
                      className={`text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                      {isSelected && (
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

              {/* Exact Quote Citation */}
              <div>
                <button
                  onClick={() => toggleQuote(question.id)}
                  className="text-xs font-semibold text-[#1A6EF0] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Quote className="w-3.5 h-3.5" />
                  <span>{isQuoteOpen ? 'Hide source quote' : 'Why? (Show exact quote)'}</span>
                </button>

                {isQuoteOpen && (
                  <div className="mt-2.5 p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-xs sm:text-sm text-[#3A3F4F] dark:text-[#F1F3F7] italic space-y-1">
                    <p>"{question.sourceQuote}"</p>
                    <p className="text-[11px] not-italic text-[#5F6573] dark:text-[#A6ACB9]">
                      From: {question.sectionTitle}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
