/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Navigation System (Material 3 Architecture)
 * Fully responsive without horizontal overflow:
 * - Desktop: Clear top navigation rail with core hubs (Learn, Practice, Plan, Library) + More dropdown
 * - Mobile: Material 3 Bottom Navigation bar (Learn, Practice, Plan, Library, More) + Slide-up More sheet
 * - Completely avoids horizontally overflowing tabs and hidden scrolling on all viewports (320px - 1440px)
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Timer,
  FolderOpen,
  MoreHorizontal,
  Moon,
  Sun,
  PlusCircle,
  FileSpreadsheet,
  Settings,
  MessageCircle,
  X,
  Lock,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Check,
} from './icons.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import { PomodoroTimer } from './PomodoroTimer.tsx';
import { SessionAudioPlayer } from './SessionAudioPlayer.tsx';
import type { CourseData, MistakeRecord } from '../types.ts';

export type MainNavDestination = 'learn' | 'practice' | 'plan' | 'library' | 'audit';

interface NavbarProps {
  course: CourseData | null;
  activeNav: MainNavDestination;
  setActiveNav: (nav: MainNavDestination) => void;
  mistakesCount: number;
  completedSectionCount: number;
  totalSections: number;
  onNewDocumentClick: () => void;
  onOpenMemo?: () => void;
  onOpenSettings?: () => void;
  onOpenFeedback?: () => void;
  onOpenAdmin?: () => void;
  onOpenPomodoro?: () => void;
  onOpenStudyPrep?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  course,
  activeNav,
  setActiveNav,
  mistakesCount,
  completedSectionCount,
  totalSections,
  onNewDocumentClick,
  onOpenMemo,
  onOpenSettings,
  onOpenFeedback,
  onOpenAdmin,
  onOpenPomodoro,
  onOpenStudyPrep,
}) => {
  const { theme, toggleTheme, t } = useThemeAndText();
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileMoreSheetOpen, setMobileMoreSheetOpen] = useState(false);

  return (
    <>
      {/* =========================================================================
          TOP BAR (DESKTOP & MOBILE HEADER)
      ========================================================================= */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors w-full ${
          theme === 'academia'
            ? 'bg-[#FAF6EE]/95 dark:bg-[#191512]/95 border-[#E2D6C5] dark:border-[#382E25]'
            : 'bg-white/95 dark:bg-[#12151B]/95 border-zinc-200/80 dark:border-zinc-800'
        }`}
      >
        <div className="w-full px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-15 gap-2 sm:gap-4">
            {/* Left: StudyMate Brand & Active Course Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                onClick={() => setActiveNav('learn')}
                className="flex items-center gap-2 cursor-pointer shrink-0"
              >
                <img
                  src="/assets/aistudio/Glowing_Wings_and_Orbiting_Robot_bb9b728c.png"
                  alt="StudyMate Logo"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain shadow-2xs border border-zinc-200/80 dark:border-zinc-700/80 bg-white"
                />
                <span
                  className={`font-bold tracking-tight text-base sm:text-lg whitespace-nowrap ${
                    theme === 'academia'
                      ? 'font-serif-scholar text-[#1E3A2F] dark:text-[#E8F0EC]'
                      : 'text-[#006A4E] dark:text-emerald-400'
                  }`}
                >
                  StudyMate
                </span>
              </div>

              {/* Course Title Badge (Desktop) */}
              {course && (
                <div className="hidden lg:flex items-center pl-2 border-l border-zinc-200 dark:border-zinc-800 max-w-xs xl:max-w-md min-w-0">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 truncate">
                    {course.documentTitle}
                  </span>
                </div>
              )}
            </div>

            {/* Center: Desktop Navigation Hubs (No horizontal scroll, clean 4 destinations) */}
            {course && (
              <nav
                className="hidden md:flex items-center gap-1 bg-zinc-100/90 dark:bg-zinc-850 p-1 rounded-2xl border border-zinc-200/80 dark:border-zinc-750 shadow-2xs"
                aria-label="Primary navigation"
              >
                <button
                  type="button"
                  onClick={() => setActiveNav('learn')}
                  className={`h-8.5 px-3.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeNav === 'learn'
                      ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>Learn</span>
                  <span className="text-[10px] opacity-75 tabular-nums">
                    ({completedSectionCount}/{totalSections})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNav('practice')}
                  className={`h-8.5 px-3.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeNav === 'practice'
                      ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>Practice</span>
                  {mistakesCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {mistakesCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNav('plan')}
                  className={`h-8.5 px-3.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeNav === 'plan'
                      ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Timer className="w-3.5 h-3.5 shrink-0" />
                  <span>Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNav('library')}
                  className={`h-8.5 px-3.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeNav === 'library'
                      ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>Library</span>
                </button>
              </nav>
            )}

            {/* Right: Actions, Theme, Settings, Memo & More Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Pomodoro compact timer (Tablet & Desktop) */}
              <div className="hidden lg:flex items-center">
                <PomodoroTimer compact={true} onOpenFull={onOpenPomodoro} />
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700/80 transition-colors shadow-2xs cursor-pointer"
                title={`Active Theme: ${theme}. Tap to cycle themes.`}
                aria-label="Cycle theme"
              >
                {theme === 'cosmic' || theme === 'high-contrast' ? (
                  <Sun className="w-4 h-4 shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 shrink-0" />
                )}
              </button>

              {/* Full Settings Option on Navbar (Visible on Homescreen) */}
              {!course && onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="h-9 px-3 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700/80 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                  title="Open StudyMate Settings"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <span>Settings</span>
                </button>
              )}

              {/* Memo 3D Assistant Shortcut */}
              {onOpenMemo && (
                <button
                  type="button"
                  onClick={onOpenMemo}
                  className="h-9 px-2.5 sm:px-3 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold border border-blue-200 dark:border-blue-800/80 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                  title="Ask Memo · Doubts & Configurations"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1A6EF0] dark:bg-blue-400 animate-pulse shrink-0" />
                  <span className="leading-none">Memo</span>
                </button>
              )}

              {/* Desktop "More" Dropdown Menu */}
              {course && (
                <div className="relative hidden md:block">
                  <button
                    type="button"
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className="h-9 px-2.5 inline-flex items-center justify-center gap-1 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700/80 transition-colors cursor-pointer shadow-2xs"
                    title="More actions & course audit"
                    aria-expanded={moreDropdownOpen}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span>More</span>
                  </button>

                  {/* Dropdown Menu */}
                  {moreDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setMoreDropdownOpen(false)}
                        aria-hidden="true"
                      />
                      <div className="absolute right-0 top-11 z-40 w-56 p-2 bg-white dark:bg-[#1A1E27] rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-xl space-y-1 animate-fadeIn text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setMoreDropdownOpen(false);
                            setActiveNav('audit');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-[#006A4E] dark:text-emerald-400" />
                          <span>Content Audit Ledger</span>
                        </button>

                        {onOpenStudyPrep && (
                          <button
                            type="button"
                            onClick={() => {
                              setMoreDropdownOpen(false);
                              onOpenStudyPrep();
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                          >
                            <Headphones className="w-4 h-4 text-zinc-500" />
                            <span>Study Space Setup</span>
                          </button>
                        )}

                        {onOpenSettings && (
                          <button
                            type="button"
                            onClick={() => {
                              setMoreDropdownOpen(false);
                              onOpenSettings();
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                          >
                            <Settings className="w-4 h-4 text-zinc-500" />
                            <span>Settings & About</span>
                          </button>
                        )}

                        {onOpenFeedback && (
                          <button
                            type="button"
                            onClick={() => {
                              setMoreDropdownOpen(false);
                              onOpenFeedback();
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4 text-zinc-500" />
                            <span>Share Feedback</span>
                          </button>
                        )}

                        {onOpenAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setMoreDropdownOpen(false);
                              onOpenAdmin();
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer border-t border-zinc-100 dark:border-zinc-800 pt-2"
                          >
                            <Lock className="w-4 h-4 text-amber-600" />
                            <span>Admin System Portal</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Start New Document Button */}
              {course && (
                <button
                  type="button"
                  onClick={onNewDocumentClick}
                  className="h-9 px-3 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white transition-colors cursor-pointer shadow-xs whitespace-nowrap active:scale-[0.98]"
                  title="Upload or change document"
                  aria-label="New document"
                >
                  <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">New course</span>
                  <span className="sm:hidden">New</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MOBILE MATERIAL 3 BOTTOM NAVIGATION BAR (FIXED BOTTOM AT SCREEN)
      ========================================================================= */}
      {course && (
        <nav
          className={`md:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-md transition-colors ${
            theme === 'academia'
              ? 'bg-[#FAF6EE]/98 dark:bg-[#191512]/98 border-[#E2D6C5] dark:border-[#382E25]'
              : 'bg-white/98 dark:bg-[#12151B]/98 border-zinc-200/90 dark:border-zinc-800'
          }`}
          aria-label="Mobile bottom navigation"
        >
          <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
            {/* 1. Learn */}
            <button
              type="button"
              onClick={() => setActiveNav('learn')}
              className={`flex flex-col items-center justify-center gap-1 py-1 rounded-2xl min-h-[44px] transition-colors cursor-pointer ${
                activeNav === 'learn'
                  ? 'text-[#1A6EF0] dark:text-[#64B5F6] font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 font-medium'
              }`}
            >
              <div
                className={`w-9 h-6 rounded-full flex items-center justify-center transition-all ${
                  activeNav === 'learn'
                    ? 'bg-blue-100 dark:bg-blue-950/70 text-[#1A6EF0] dark:text-[#64B5F6]'
                    : ''
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
              </div>
              <span className="text-[10px] leading-none">Learn</span>
            </button>

            {/* 2. Practice */}
            <button
              type="button"
              onClick={() => setActiveNav('practice')}
              className={`flex flex-col items-center justify-center gap-1 py-1 rounded-2xl min-h-[44px] transition-colors cursor-pointer relative ${
                activeNav === 'practice'
                  ? 'text-[#1A6EF0] dark:text-[#64B5F6] font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 font-medium'
              }`}
            >
              <div
                className={`w-9 h-6 rounded-full flex items-center justify-center transition-all ${
                  activeNav === 'practice'
                    ? 'bg-blue-100 dark:bg-blue-950/70 text-[#1A6EF0] dark:text-[#64B5F6]'
                    : ''
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
              </div>
              <span className="text-[10px] leading-none">Practice</span>
              {mistakesCount > 0 && (
                <span className="absolute top-1.5 right-4 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            {/* 3. Plan */}
            <button
              type="button"
              onClick={() => setActiveNav('plan')}
              className={`flex flex-col items-center justify-center gap-1 py-1 rounded-2xl min-h-[44px] transition-colors cursor-pointer ${
                activeNav === 'plan'
                  ? 'text-[#1A6EF0] dark:text-[#64B5F6] font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 font-medium'
              }`}
            >
              <div
                className={`w-9 h-6 rounded-full flex items-center justify-center transition-all ${
                  activeNav === 'plan'
                    ? 'bg-blue-100 dark:bg-blue-950/70 text-[#1A6EF0] dark:text-[#64B5F6]'
                    : ''
                }`}
              >
                <Timer className="w-4 h-4 shrink-0" />
              </div>
              <span className="text-[10px] leading-none">Plan</span>
            </button>

            {/* 4. Library */}
            <button
              type="button"
              onClick={() => setActiveNav('library')}
              className={`flex flex-col items-center justify-center gap-1 py-1 rounded-2xl min-h-[44px] transition-colors cursor-pointer ${
                activeNav === 'library'
                  ? 'text-[#1A6EF0] dark:text-[#64B5F6] font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 font-medium'
              }`}
            >
              <div
                className={`w-9 h-6 rounded-full flex items-center justify-center transition-all ${
                  activeNav === 'library'
                    ? 'bg-blue-100 dark:bg-blue-950/70 text-[#1A6EF0] dark:text-[#64B5F6]'
                    : ''
                }`}
              >
                <FolderOpen className="w-4 h-4 shrink-0" />
              </div>
              <span className="text-[10px] leading-none">Library</span>
            </button>

            {/* 5. More */}
            <button
              type="button"
              onClick={() => setMobileMoreSheetOpen(true)}
              className="flex flex-col items-center justify-center gap-1 py-1 rounded-2xl min-h-[44px] text-zinc-500 dark:text-zinc-400 font-medium transition-colors cursor-pointer"
            >
              <div className="w-9 h-6 rounded-full flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 shrink-0" />
              </div>
              <span className="text-[10px] leading-none">More</span>
            </button>
          </div>
        </nav>
      )}

      {/* Mobile "More" Slide-up Sheet */}
      {mobileMoreSheetOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
            onClick={() => setMobileMoreSheetOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="More Features"
            className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-[#181C24] rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 p-5 space-y-3 shadow-2xl animate-fadeIn max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                More Features & Tools
              </span>
              <button
                type="button"
                onClick={() => setMobileMoreSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center cursor-pointer"
                aria-label="Close sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMoreSheetOpen(false);
                  setActiveNav('audit');
                }}
                className="w-full text-left p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#006A4E] dark:text-emerald-400" />
                <div>
                  <div className="font-semibold">Content Audit Ledger</div>
                  <div className="text-[10px] text-zinc-500 font-normal">
                    Inspect original citations & skipped filler
                  </div>
                </div>
              </button>

              {onOpenStudyPrep && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMoreSheetOpen(false);
                    onOpenStudyPrep();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-zinc-500" />
                  <div>
                    <div className="font-semibold">Study Space Setup</div>
                    <div className="text-[10px] text-zinc-500 font-normal">
                      5-step checklist for distraction-free study
                    </div>
                  </div>
                </button>
              )}

              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMoreSheetOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-zinc-500" />
                  <div>
                    <div className="font-semibold">Settings & About</div>
                    <div className="text-[10px] text-zinc-500 font-normal">
                      Themes, neurodiversity aids, notes from Hamza
                    </div>
                  </div>
                </button>
              )}

              {onOpenFeedback && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMoreSheetOpen(false);
                    onOpenFeedback();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-zinc-500" />
                  <div>
                    <div className="font-semibold">Share Feedback</div>
                    <div className="text-[10px] text-zinc-500 font-normal">
                      Suggest improvements directly to the maker
                    </div>
                  </div>
                </button>
              )}

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMoreSheetOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-3 transition-colors cursor-pointer border border-amber-200 dark:border-amber-900/60"
                >
                  <Lock className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold">Admin System Portal</div>
                    <div className="text-[10px] text-amber-700/80 dark:text-amber-300 font-normal">
                      Secured upload logs & user metrics
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
