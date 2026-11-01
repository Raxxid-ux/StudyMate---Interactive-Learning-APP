/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Progress & Habit Tracker Header
 * Fully responsive across Classic, Compact, and Minimal UI modes to prevent student stress.
 * Cleanly separates Meadow Sage (default benchmark) from Dark Academia (scholar theme).
 */

import React from 'react';
import {
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  BookOpen,
  FileText,
  Timer,
  Layout,
  Zap,
} from './icons.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';

interface ScholarProgressHeaderProps {
  completedCount: number;
  totalSections: number;
  onStartQuiz: () => void;
  onOpenPomodoro: () => void;
  onOpenNotes: () => void;
  onBrowseLibrary: () => void;
  currentLessonTitle?: string;
}

export const ScholarProgressHeader: React.FC<ScholarProgressHeaderProps> = ({
  completedCount,
  totalSections,
  onStartQuiz,
  onOpenPomodoro,
  onOpenNotes,
  onBrowseLibrary,
  currentLessonTitle,
}) => {
  const {
    t,
    theme,
    totalStudyMinutes,
    studyStreakDays,
    uiDensity,
    cycleUiDensity,
  } = useThemeAndText();

  // Dynamic progress percentage
  const percentCompleted =
    totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  // Format total study time (e.g. 28h 45m)
  const hours = Math.floor(totalStudyMinutes / 60);
  const mins = totalStudyMinutes % 60;

  // Greeting based on time of day
  const currentHour = new Date().getHours();
  let greeting = t.greetingMorning;
  if (currentHour >= 12 && currentHour < 17) {
    greeting = t.greetingAfternoon;
  } else if (currentHour >= 17) {
    greeting = t.greetingEvening;
  }

  // Circular gauge radius
  const radius = uiDensity === 'compact' ? 22 : 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentCompleted / 100) * circumference;

  // ==========================================
  // 1. MINIMAL UI MODE: LOW-DISTRACTION CALM VIEW
  // ==========================================
  if (uiDensity === 'minimal') {
    return (
      <div
        className={`px-4 py-3 rounded-2xl border transition-all mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
          theme === 'academia'
            ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E4D8C8] dark:border-[#382E25]'
            : 'bg-white dark:bg-[#1A1E27] border-zinc-200/80 dark:border-zinc-800'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              theme === 'academia' ? 'bg-[#C5A059]' : 'bg-[#22D08B]'
            }`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-sm">
                {currentLessonTitle || greeting}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {completedCount}/{totalSections} done ({percentCompleted}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Subtle thin progress bar */}
          <div className="w-24 sm:w-32 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                theme === 'academia' ? 'bg-[#C5A059]' : 'bg-[#22D08B]'
              }`}
              style={{ width: `${percentCompleted}%` }}
            />
          </div>

          <button
            type="button"
            onClick={cycleUiDensity}
            className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Expand to Compact or Classic view"
          >
            Expand View
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. COMPACT & CLASSIC MODES
  // ==========================================
  const isCompact = uiDensity === 'compact';

  return (
    <div
      className={`rounded-3xl border transition-all mb-5 shadow-2xs ${
        isCompact ? 'p-3.5 sm:p-5' : 'p-5 sm:p-7'
      } ${
        theme === 'academia'
          ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E4D8C8] dark:border-[#382E25] text-[#2B231D] dark:text-[#F3EAE0]'
          : 'bg-white dark:bg-[#1A1E27] border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100'
      }`}
    >
      {/* Top Row: Greeting & Motivation on Left + Habit Trackers on Right */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between ${isCompact ? 'gap-4' : 'gap-6'}`}>
        {/* Left: Greeting */}
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <h2
              className={`tracking-tight ${
                isCompact ? 'text-xl sm:text-2xl font-semibold' : 'text-2xl sm:text-3xl lg:text-4xl'
              } ${
                theme === 'academia'
                  ? 'font-serif-scholar text-[#1E3A2F] dark:text-[#E8F0EC] font-semibold'
                  : 'font-semibold text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {greeting}
            </h2>
            {isCompact && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Compact
              </span>
            )}
          </div>

          <p
            className={`italic ${
              isCompact ? 'text-xs' : 'text-sm sm:text-base'
            } ${
              theme === 'academia'
                ? 'text-[#6B5A4B] dark:text-[#C5B5A5]'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {t.greetingSub}
          </p>

          {/* Underline accent */}
          <div
            className={`h-1 rounded-full ${isCompact ? 'w-10 mt-1' : 'w-14 mt-2'} ${
              theme === 'academia' ? 'bg-[#C5A059] dark:bg-[#D4AF37]' : 'bg-[#22D08B]'
            }`}
          />
        </div>

        {/* Right: 3 Progress and Habit Trackers */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
          {/* Card 1: Study Progress Circular Gauge */}
          <div
            className={`rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
              isCompact ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'
            } ${
              theme === 'academia'
                ? 'bg-[#F2ECE1] dark:bg-[#251F18] border-[#DECFC0] dark:border-[#3A3025]'
                : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/80 dark:border-zinc-700'
            }`}
          >
            <div className={`relative flex items-center justify-center ${isCompact ? 'w-12 h-12' : 'w-16 h-16'}`}>
              <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  className={
                    theme === 'academia'
                      ? 'stroke-[#E4D8C8] dark:stroke-[#382E25]'
                      : 'stroke-zinc-200 dark:stroke-zinc-700'
                  }
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  className={`transition-all duration-700 ease-out ${
                    theme === 'academia'
                      ? 'stroke-[#8C6239] dark:stroke-[#D4AF37]'
                      : 'stroke-[#22D08B] dark:stroke-[#34D399]'
                  }`}
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span
                className={`absolute font-bold font-mono ${
                  isCompact ? 'text-xs' : 'text-sm sm:text-base'
                } ${
                  theme === 'academia' ? 'text-[#2B231D] dark:text-[#F3EAE0]' : 'text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {percentCompleted}%
              </span>
            </div>
            <span
              className={`text-[10px] sm:text-xs font-semibold mt-1 ${
                theme === 'academia' ? 'text-[#6B5A4B] dark:text-[#C5B5A5]' : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {t.studyProgress}
            </span>
          </div>

          {/* Card 2: Streak Days */}
          <div
            className={`rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
              isCompact ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'
            } ${
              theme === 'academia'
                ? 'bg-[#F2ECE1] dark:bg-[#251F18] border-[#DECFC0] dark:border-[#3A3025]'
                : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/80 dark:border-zinc-700'
            }`}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-0.5">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div
              className={`flex items-center gap-0.5 font-bold font-mono ${
                isCompact ? 'text-sm' : 'text-base sm:text-lg'
              } ${
                theme === 'academia' ? 'text-[#2B231D] dark:text-[#F3EAE0]' : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              <span>{studyStreakDays}d</span>
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 shrink-0" />
            </div>
            <span
              className={`text-[10px] sm:text-xs font-semibold ${
                theme === 'academia' ? 'text-[#6B5A4B] dark:text-[#C5B5A5]' : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {t.streak}
            </span>
          </div>

          {/* Card 3: Total Study Time */}
          <div
            className={`rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
              isCompact ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'
            } ${
              theme === 'academia'
                ? 'bg-[#F2ECE1] dark:bg-[#251F18] border-[#DECFC0] dark:border-[#3A3025]'
                : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/80 dark:border-zinc-700'
            }`}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-0.5">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div
              className={`font-bold font-mono ${
                isCompact ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'
              } ${
                theme === 'academia' ? 'text-[#2B231D] dark:text-[#F3EAE0]' : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {hours}h {mins}m
            </div>
            <span
              className={`text-[10px] sm:text-xs font-semibold ${
                theme === 'academia' ? 'text-[#6B5A4B] dark:text-[#C5B5A5]' : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {t.totalStudyTime}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions Bar */}
      <div
        className={`pt-3 border-t ${isCompact ? 'mt-3' : 'mt-5 pt-4'} ${
          theme === 'academia' ? 'border-[#E4D8C8]/80 dark:border-[#382E25]' : 'border-zinc-100 dark:border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              theme === 'academia' ? 'text-[#6B5A4B] dark:text-[#C5B5A5]' : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            {t.quickActions}
          </span>
          {currentLessonTitle && (
            <span
              className={`text-xs font-medium truncate max-w-xs ${
                theme === 'academia' ? 'text-[#8C6239] dark:text-[#D4AF37]' : 'text-[#1A6EF0] dark:text-[#64B5F6]'
              }`}
            >
              Active: {currentLessonTitle}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onStartQuiz}
            className={`p-2.5 sm:p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'academia'
                ? 'bg-[#EDE4D5] hover:bg-[#E4D8C5] border-[#DECFC0] text-[#4A3728] dark:bg-[#251F18] dark:hover:bg-[#2F271F] dark:border-[#3A3025] dark:text-[#E8CE9D]'
                : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                theme === 'academia' ? 'text-[#8C6239] dark:text-[#D4AF37]' : 'text-blue-500'
              }`}
            />
            <span>{t.startQuiz}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPomodoro}
            className={`p-2.5 sm:p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'academia'
                ? 'bg-[#EDE4D5] hover:bg-[#E4D8C5] border-[#DECFC0] text-[#4A3728] dark:bg-[#251F18] dark:hover:bg-[#2F271F] dark:border-[#3A3025] dark:text-[#E8CE9D]'
                : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200'
            }`}
          >
            <Timer
              className={`w-3.5 h-3.5 ${
                theme === 'academia' ? 'text-[#8C6239] dark:text-[#D4AF37]' : 'text-amber-500'
              }`}
            />
            <span>{t.planStudy}</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotes}
            className={`p-2.5 sm:p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'academia'
                ? 'bg-[#EDE4D5] hover:bg-[#E4D8C5] border-[#DECFC0] text-[#4A3728] dark:bg-[#251F18] dark:hover:bg-[#2F271F] dark:border-[#3A3025] dark:text-[#E8CE9D]'
                : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200'
            }`}
          >
            <FileText
              className={`w-3.5 h-3.5 ${
                theme === 'academia' ? 'text-[#8C6239] dark:text-[#D4AF37]' : 'text-blue-500'
              }`}
            />
            <span>{t.addNote}</span>
          </button>

          <button
            type="button"
            onClick={onBrowseLibrary}
            className={`p-2.5 sm:p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'academia'
                ? 'bg-[#EDE4D5] hover:bg-[#E4D8C5] border-[#DECFC0] text-[#4A3728] dark:bg-[#251F18] dark:hover:bg-[#2F271F] dark:border-[#3A3025] dark:text-[#E8CE9D]'
                : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200'
            }`}
          >
            <BookOpen
              className={`w-3.5 h-3.5 ${
                theme === 'academia' ? 'text-[#8C6239] dark:text-[#D4AF37]' : 'text-purple-500'
              }`}
            />
            <span>{t.browseLibrary}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
