/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Scholar Progress & Habit Trackers
 * Designed with reference to Dark Academia scholar interface (image_65ef7044.png).
 * Features circular progress ring gauge, streak counter, total study timer, and quick action bar.
 */

import React from 'react';
import {
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  Play,
  BookOpen,
  FileText,
  Timer,
  ArrowRight,
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
  const { t, theme, language, totalStudyMinutes, studyStreakDays } = useThemeAndText();

  // Dynamic progress percentage (defaulting to 78% benchmark if no lessons, or calculated from progress)
  const percentCompleted =
    totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 78;

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

  // SVG Circular progress radius
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentCompleted / 100) * circumference;

  return (
    <div
      className={`p-5 sm:p-7 rounded-3xl border transition-all mb-6 shadow-sm ${
        theme === 'academia'
          ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E4D8C8] dark:border-[#382E25] text-[#2B231D] dark:text-[#F3EAE0]'
          : 'bg-white dark:bg-[#1A1E27] border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100'
      }`}
    >
      {/* Top Row: Scholar Greeting on Left + 3 Trackers on Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Scholar Greeting */}
        <div className="space-y-1.5 max-w-xl">
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[#1E3A2F] dark:text-[#E8F0EC] ${
              theme === 'academia' ? 'font-serif-scholar font-semibold' : 'font-semibold'
            }`}
          >
            {greeting}
          </h2>

          <p className="text-sm sm:text-base italic text-[#6B5A4B] dark:text-[#C5B5A5]">
            {t.greetingSub}
          </p>

          {/* Elegant gold decorative underline from reference image */}
          <div className="w-14 h-1 bg-[#C5A059] dark:bg-[#D4AF37] rounded-full mt-2" />
        </div>

        {/* Right: 3 Progress and Habit Tracker Cards matching Reference Image */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 shrink-0">
          {/* Card 1: Circular Study Progress */}
          <div
            className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border flex flex-col items-center justify-center text-center transition-all ${
              theme === 'academia'
                ? 'bg-[#F2ECE1] dark:bg-[#251F18] border-[#DECFC0] dark:border-[#3A3025]'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  className="stroke-[#E4D8C8] dark:stroke-[#382E25]"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  className="stroke-[#8C6239] dark:stroke-[#D4AF37] transition-all duration-700 ease-out"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-sm sm:text-base font-bold font-mono text-[#2B231D] dark:text-[#F3EAE0]">
                {percentCompleted}%
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold mt-1 text-[#6B5A4B] dark:text-[#C5B5A5]">
              {t.studyProgress}
            </span>
          </div>

          {/* Card 2: Streak Days */}
          <div
            className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border flex flex-col items-center justify-center text-center transition-all ${
              theme === 'academia'
                ? 'bg-[#F2ECE1] dark:bg-[#251F18] border-[#DECFC0] dark:border-[#3A3025]'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 font-bold text-base sm:text-lg text-[#2B231D] dark:text-[#F3EAE0]">
              <span>{studyStreakDays} {t.streakDays}</span>
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#6B5A4B] dark:text-[#C5B5A5]">
              {t.streak}
            </span>
          </div>

          {/* Card 3: Total Study Time */}
          <div
            className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border flex flex-col items-center justify-center text-center transition-all ${
              theme === 'academia'
                ? 'bg-[#F2ECE1] dark:bg-[#251F18] border-[#DECFC0] dark:border-[#3A3025]'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-bold text-base sm:text-lg font-mono text-[#2B231D] dark:text-[#F3EAE0]">
              {hours}{t.hours} {mins}{t.minutes}
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#6B5A4B] dark:text-[#C5B5A5]">
              {t.totalStudyTime}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions Bar from Reference Image */}
      <div className="mt-5 pt-4 border-t border-[#E4D8C8]/80 dark:border-[#382E25]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B5A4B] dark:text-[#C5B5A5]">
            {t.quickActions}
          </span>
          {currentLessonTitle && (
            <span className="text-xs text-[#8C6239] dark:text-[#D4AF37] font-medium truncate max-w-xs">
              Active: {currentLessonTitle}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={onStartQuiz}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'academia'
                ? 'bg-[#EDE4D5] hover:bg-[#E4D8C5] border-[#DECFC0] text-[#4A3728] dark:bg-[#251F18] dark:hover:bg-[#2F271F] dark:border-[#3A3025] dark:text-[#E8CE9D]'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#D4AF37]" />
            <span>{t.startQuiz}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPomodoro}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'academia'
                ? 'bg-[#EDE4D5] hover:bg-[#E4D8C5] border-[#DECFC0] text-[#4A3728] dark:bg-[#251F18] dark:hover:bg-[#2F271F] dark:border-[#3A3025] dark:text-[#E8CE9D]'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#D4AF37]" />
            <span>{t.planStudy}</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotes}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'academia'
                ? 'bg-[#EDE4D5] hover:bg-[#E4D8C5] border-[#DECFC0] text-[#4A3728] dark:bg-[#251F18] dark:hover:bg-[#2F271F] dark:border-[#3A3025] dark:text-[#E8CE9D]'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#D4AF37]" />
            <span>{t.addNote}</span>
          </button>

          <button
            type="button"
            onClick={onBrowseLibrary}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'academia'
                ? 'bg-[#EDE4D5] hover:bg-[#E4D8C5] border-[#DECFC0] text-[#4A3728] dark:bg-[#251F18] dark:hover:bg-[#2F271F] dark:border-[#3A3025] dark:text-[#E8CE9D]'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#D4AF37]" />
            <span>{t.browseLibrary}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
