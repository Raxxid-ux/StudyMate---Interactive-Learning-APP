/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Planner View
 * Consolidates habit tracking, study progress metrics, Pomodoro timer,
 * study space readiness setup, and pacing tools in one dedicated screen.
 */

import React from 'react';
import {
  Timer,
  Clock,
  Flame,
  Calendar,
  CheckCircle2,
  BookOpen,
  Headphones,
  Award,
} from './icons.tsx';
import { ScholarProgressHeader } from './ScholarProgressHeader.tsx';
import { PomodoroTimer } from './PomodoroTimer.tsx';
import { SessionAudioPlayer } from './SessionAudioPlayer.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { CourseData } from '../types.ts';

interface PlannerViewProps {
  course: CourseData;
  completedSectionCount: number;
  onStartQuiz: () => void;
  onOpenNotes: () => void;
  onBrowseLibrary: () => void;
  onOpenStudyPrep: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  course,
  completedSectionCount,
  onStartQuiz,
  onOpenNotes,
  onBrowseLibrary,
  onOpenStudyPrep,
}) => {
  const { theme, totalStudyMinutes, studyStreakDays, t } = useThemeAndText();

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36 space-y-6">
      {/* Overview Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Study Planner & Habits
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Pacing, focus intervals & daily progress
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
          Plan Your Learning Journey
        </h1>
      </div>

      {/* Scholar Habit Metrics (Study Progress %, Streak, Total Time) */}
      <ScholarProgressHeader
        completedCount={completedSectionCount}
        totalSections={course.sections.length}
        onStartQuiz={onStartQuiz}
        onOpenPomodoro={() => {}}
        onOpenNotes={onOpenNotes}
        onBrowseLibrary={onBrowseLibrary}
        currentLessonTitle={course.sections[0]?.title}
      />

      {/* Focus Timer & Session Audio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Interactive Pomodoro Widget */}
        <div
          className={`p-6 rounded-3xl border transition-all space-y-4 shadow-2xs ${
            theme === 'academia'
              ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E2D6C5] dark:border-[#3E342B]'
              : 'bg-white dark:bg-[#1A1E27] border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Pomodoro Focus Timer
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Interval Pacing
            </span>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            25-minute calm intervals prevent mental fatigue and build reliable daily consistency.
          </p>

          <div className="pt-2 flex justify-center">
            <PomodoroTimer compact={false} />
          </div>
        </div>

        {/* Study Space & Ambient Audio Card */}
        <div
          className={`p-6 rounded-3xl border transition-all space-y-4 shadow-2xs flex flex-col justify-between ${
            theme === 'academia'
              ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E2D6C5] dark:border-[#3E342B]'
              : 'bg-white dark:bg-[#1A1E27] border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#006A4E] dark:text-emerald-400" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Focus Audio & Environment
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Binaural & Lofi
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Low-frequency waves and gentle lo-fi beats mask background noises and keep attention grounded.
            </p>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
                Session Background Music
              </span>
              <SessionAudioPlayer />
            </div>
          </div>

          {/* Study Space Readiness Prompt */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                Study Space Checklist
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                5 simple steps to optimize your physical space
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenStudyPrep}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
            >
              Set up space
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
