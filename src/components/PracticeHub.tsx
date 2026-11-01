/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Practice Hub
 * Consolidates all retrieval and memory practice into a clean Material 3 hub:
 * - Flashcards
 * - Final Quiz
 * - Review Mistakes
 * - Exam Prep Drills
 */

import React, { useState } from 'react';
import {
  Layers,
  Award,
  AlertCircle,
  Zap,
  ArrowLeft,
} from './icons.tsx';
import { FlashcardsView } from './FlashcardsView.tsx';
import { FinalQuizView } from './FinalQuizView.tsx';
import { ReviewMistakesView } from './ReviewMistakesView.tsx';
import { ExamPrepView } from './ExamPrepView.tsx';
import type { CourseData, MistakeRecord, Question } from '../types.ts';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';

export type PracticeTab = 'flashcards' | 'final-quiz' | 'mistakes' | 'exam-prep';

interface PracticeHubProps {
  course: CourseData;
  mistakes: MistakeRecord[];
  onCorrectMistake: (questionId: string) => void;
  onRecordMistakeAgain: (question: Question, wrongAnswer: string) => void;
  onJumpToLesson: (sectionIndex: number) => void;
  initialTab?: PracticeTab;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({
  course,
  mistakes,
  onCorrectMistake,
  onRecordMistakeAgain,
  onJumpToLesson,
  initialTab = 'flashcards',
}) => {
  const { theme } = useThemeAndText();
  const [activePracticeTab, setActivePracticeTab] = useState<PracticeTab>(initialTab);

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Practice Header & Mode Switcher */}
      <div
        className={`w-full px-4 sm:px-6 py-3.5 border-b sticky top-0 z-20 backdrop-blur-md transition-colors ${
          theme === 'academia'
            ? 'bg-[#FAF6EE]/90 dark:bg-[#191512]/90 border-[#E2D6C5] dark:border-[#382E25]'
            : 'bg-white/90 dark:bg-[#12151B]/90 border-zinc-200/80 dark:border-zinc-800'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Practice Hub
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
              {course.documentTitle}
            </span>
          </div>

          {/* Segmented Control Chips */}
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar" aria-label="Practice tools">
            <button
              type="button"
              onClick={() => setActivePracticeTab('flashcards')}
              className={`h-8.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activePracticeTab === 'flashcards'
                  ? 'bg-[#1A6EF0] text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Flashcards</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePracticeTab('final-quiz')}
              className={`h-8.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activePracticeTab === 'final-quiz'
                  ? 'bg-[#1A6EF0] text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Final Quiz</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePracticeTab('mistakes')}
              className={`h-8.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activePracticeTab === 'mistakes'
                  ? 'bg-[#1A6EF0] text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Mistakes</span>
              {mistakes.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                  {mistakes.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActivePracticeTab('exam-prep')}
              className={`h-8.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activePracticeTab === 'exam-prep'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Exam Prep</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                Drill
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Practice Content */}
      <div className="flex-1 w-full overflow-y-auto">
        {activePracticeTab === 'flashcards' && <FlashcardsView course={course} />}
        {activePracticeTab === 'final-quiz' && <FinalQuizView course={course} />}
        {activePracticeTab === 'mistakes' && (
          <ReviewMistakesView
            mistakes={mistakes}
            onCorrectMistake={onCorrectMistake}
            onRecordMistakeAgain={onRecordMistakeAgain}
            onJumpToSection={onJumpToLesson}
          />
        )}
        {activePracticeTab === 'exam-prep' && (
          <ExamPrepView course={course} onJumpToLesson={onJumpToLesson} />
        )}
      </div>
    </div>
  );
};
