/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Exam Preparation & Fast Memorization View
 * Designed for rapid active-recall drills, cloze memory tests, and 1-page high-yield cheat sheet review.
 */

import React, { useState, useMemo } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  FileText,
  Printer,
  Copy,
  Check,
  Award,
  Layers,
  HelpCircle,
} from './icons.tsx';
import type { CourseData, Question, GlossaryItem } from '../types.ts';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import { playCalmChime, playSoftTap } from '../utils/audioChimes.ts';

interface ExamPrepViewProps {
  course: CourseData;
  onJumpToLesson?: (sectionIndex: number) => void;
}

export const ExamPrepView: React.FC<ExamPrepViewProps> = ({ course, onJumpToLesson }) => {
  const { fontSizeClass } = useThemeAndText();
  const [subMode, setSubMode] = useState<'sprint' | 'cloze' | 'cheatsheet'>('sprint');

  // 1. Gather all questions across all sections
  const allQuestions: Question[] = useMemo(() => {
    const list: Question[] = [];
    course.sections.forEach((sec, sIdx) => {
      if (sec.lesson?.questions) {
        sec.lesson.questions.forEach((q) => {
          list.push({
            ...q,
            sectionIndex: sIdx,
            sectionTitle: sec.title,
          });
        });
      }
    });
    return list;
  }, [course]);

  // 2. Gather all glossary terms
  const allGlossary: Array<GlossaryItem & { sectionTitle: string; sectionIndex: number }> = useMemo(() => {
    const list: Array<GlossaryItem & { sectionTitle: string; sectionIndex: number }> = [];
    course.sections.forEach((sec, sIdx) => {
      if (sec.lesson?.glossary) {
        sec.lesson.glossary.forEach((g) => {
          list.push({
            ...g,
            sectionTitle: sec.title,
            sectionIndex: sIdx,
          });
        });
      }
    });
    return list;
  }, [course]);

  // Sprint Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [sprintScore, setSprintScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [retryQueue, setRetryQueue] = useState<Question[]>([]);

  // Cloze State
  const [clozeIndex, setClozeIndex] = useState(0);
  const [isClozeRevealed, setIsClozeRevealed] = useState(false);
  const [copiedSheet, setCopiedSheet] = useState(false);

  const activeQuestion = allQuestions[currentIndex] || null;
  const activeCloze = allGlossary[clozeIndex] || null;

  // Answer selection in speed sprint
  const handleSelectSprintOption = (opt: string) => {
    if (isAnswerRevealed || !activeQuestion) return;
    setSelectedAnswer(opt);
    setIsAnswerRevealed(true);

    const isCorrect = opt === activeQuestion.correctAnswer;
    if (isCorrect) {
      playCalmChime(true);
      setSprintScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      playSoftTap(true);
      setSprintScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
      setRetryQueue((prev) => [...prev, activeQuestion]);
    }
  };

  const handleNextSprintQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (retryQueue.length > 0) {
      // Loop over missed questions
      setCurrentIndex(0);
    }
  };

  const handleCopyCheatSheet = () => {
    let sheetText = `EXAM REVISION CHEAT SHEET: ${course.documentTitle}\n\n`;
    sheetText += `=== CORE DEFINITIONS & GLOSSARY ===\n`;
    allGlossary.forEach((g) => {
      sheetText += `• ${g.term}: ${g.definition} [from ${g.sectionTitle}]\n`;
    });
    sheetText += `\n=== SECTION KEY TAKEAWAYS ===\n`;
    course.sections.forEach((s) => {
      if (s.lesson?.keyPoints) {
        sheetText += `\n[${s.title}]\n`;
        s.lesson.keyPoints.forEach((kp) => {
          sheetText += ` - ${kp}\n`;
        });
      }
    });

    navigator.clipboard.writeText(sheetText);
    setCopiedSheet(true);
    playCalmChime(true);
    setTimeout(() => setCopiedSheet(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const readinessPercent = allQuestions.length > 0
    ? Math.min(100, Math.round((sprintScore.correct / Math.max(1, allQuestions.length)) * 100))
    : 80;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 pt-8 pb-36 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Top Banner: Exam Readiness Gauge */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/10 via-amber-500/10 to-emerald-500/10 dark:from-blue-950/30 dark:via-amber-950/20 dark:to-emerald-950/30 border border-amber-300/60 dark:border-amber-800/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Exam Preparation Mode
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Fast Retention
              </span>
            </div>
            <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
              High-yield recall drills and 1-page review sheet for rapid memorization before exams.
            </p>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="flex items-center gap-3 bg-white/80 dark:bg-zinc-900/80 px-4 py-2.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shrink-0">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Exam Readiness</div>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {readinessPercent}% Ready
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {sprintScore.correct}/{allQuestions.length}
          </div>
        </div>
      </div>

      {/* Sub-mode Navigation Buttons */}
      <div className="flex items-center gap-2 border-b border-zinc-200/80 dark:border-zinc-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setSubMode('sprint')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            subMode === 'sprint'
              ? 'bg-[#1A6EF0] text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100/80 dark:bg-zinc-800/80'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Speed Recall Sprint ({allQuestions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubMode('cloze')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            subMode === 'cloze'
              ? 'bg-[#1A6EF0] text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100/80 dark:bg-zinc-800/80'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Blind Concept Drill ({allGlossary.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubMode('cheatsheet')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            subMode === 'cheatsheet'
              ? 'bg-[#1A6EF0] text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100/80 dark:bg-zinc-800/80'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1-Page High-Yield Cheat Sheet</span>
        </button>
      </div>

      {/* SUB-MODE 1: SPEED RECALL SPRINT */}
      {subMode === 'sprint' && (
        <div className="space-y-6">
          {activeQuestion ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A22] border border-zinc-200/90 dark:border-zinc-800 shadow-md space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold text-[#1A6EF0] dark:text-[#64B5F6]">
                  {activeQuestion.sectionTitle}
                </span>
                <span className="tabular-nums font-mono">
                  Question {currentIndex + 1} of {allQuestions.length}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                {activeQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {activeQuestion.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === activeQuestion.correctAnswer;

                  let optStyles = 'border-zinc-200/80 dark:border-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600 bg-zinc-50/70 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-200';

                  if (isAnswerRevealed) {
                    if (isCorrect) {
                      optStyles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optStyles = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100';
                    } else {
                      optStyles = 'opacity-40 border-zinc-200 dark:border-zinc-800';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswerRevealed}
                      onClick={() => handleSelectSprintOption(opt)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${optStyles}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-xs sm:text-sm">{opt}</span>
                      </div>
                      {isAnswerRevealed && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quote Grounding & Next */}
              {isAnswerRevealed && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-4 animate-fadeIn">
                  {activeQuestion.sourceQuote && (
                    <div className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300 italic border border-zinc-200/60 dark:border-zinc-700">
                      " {activeQuestion.sourceQuote} "
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      {selectedAnswer === activeQuestion.correctAnswer ? 'Great memory!' : 'Queued for quick retry'}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextSprintQuestion}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#1A6EF0] hover:bg-[#1558C4] text-white shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <Award className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Sprint Session Complete!
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                You scored {sprintScore.correct} out of {allQuestions.length} correct in this rapid recall test.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrentIndex(0);
                  setSprintScore({ correct: 0, total: 0 });
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1A6EF0] text-white"
              >
                Restart Sprint
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-MODE 2: BLIND CONCEPTS / CLOZE MEMORY DRILL */}
      {subMode === 'cloze' && (
        <div className="space-y-6">
          {activeCloze ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A22] border border-zinc-200/90 dark:border-zinc-800 shadow-md space-y-6 text-center">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Concept {clozeIndex + 1} of {allGlossary.length}
                </span>
                <span>{activeCloze.sectionTitle}</span>
              </div>

              {/* Definition Prompt */}
              <div className="space-y-2 py-4">
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
                  Can you name this term from its definition?
                </span>
                <p className="text-base sm:text-xl font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed max-w-xl mx-auto">
                  "{activeCloze.definition}"
                </p>
              </div>

              {/* Hidden Term Box */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 max-w-md mx-auto">
                {isClozeRevealed ? (
                  <div className="space-y-1 animate-fadeIn">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                      Term / Concept
                    </span>
                    <div className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                      {activeCloze.term}
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-zinc-400 text-sm font-semibold tracking-wider">
                    [ ? ? ? ? ? ]
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="pt-2 flex items-center justify-center gap-3">
                {!isClozeRevealed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsClozeRevealed(true);
                      playCalmChime(true);
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#1A6EF0] hover:bg-[#1558C4] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                  >
                    Reveal Answer
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsClozeRevealed(false);
                        setClozeIndex((prev) => (prev + 1) % allGlossary.length);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-300 cursor-pointer"
                    >
                      Need Review
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsClozeRevealed(false);
                        setClozeIndex((prev) => (prev + 1) % allGlossary.length);
                        playCalmChime(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>I Knew It · Next</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-zinc-500">
              No glossary definitions in this course.
            </div>
          )}
        </div>
      )}

      {/* SUB-MODE 3: HIGH-YIELD 1-PAGE CHEAT SHEET */}
      {subMode === 'cheatsheet' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Comprehensive 1-Page Revision Sheet
              </h3>
              <p className="text-xs text-zinc-500">
                High-density summary of all terms, key takeaways, and formulas in one place.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCheatSheet}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-[#1A6EF0] transition-colors cursor-pointer shadow-2xs"
              >
                {copiedSheet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1A6EF0] text-white hover:bg-[#1558C4] transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sheet</span>
              </button>
            </div>
          </div>

          {/* Printable Sheet Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161A22] border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-6 print:border-none print:shadow-none">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                {course.documentTitle}
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                StudyMate High-Yield Fast Memorization Cram Guide · Generated {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Glossary Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A6EF0] dark:text-[#64B5F6] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Essential Terms & Definitions ({allGlossary.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allGlossary.map((g, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 space-y-1"
                  >
                    <div className="font-bold text-xs text-zinc-900 dark:text-white">
                      {g.term}
                    </div>
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {g.definition}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Section Takeaways */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>High-Yield Section Key Points</span>
              </h4>

              <div className="space-y-4">
                {course.sections.map((sec, sIdx) => {
                  const points = sec.lesson?.keyPoints || [];
                  if (points.length === 0) return null;

                  return (
                    <div key={sIdx} className="space-y-1.5">
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Lesson {sIdx + 1}: {sec.title}
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {points.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
