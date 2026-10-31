import React, { useState } from 'react';
import {
  BookOpen,
  Moon,
  Sun,
  PlusCircle,
  AlertCircle,
  Layers,
  Award,
  FileSpreadsheet,
  Settings,
  Menu,
  X,
  MessageCircle,
  Timer,
  Zap,
  Layout,
} from './icons.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import { PomodoroTimer } from './PomodoroTimer.tsx';
import { SessionAudioPlayer } from './SessionAudioPlayer.tsx';
import type { CourseData, MistakeRecord } from '../types.ts';

interface NavbarProps {
  course: CourseData | null;
  activeTab: 'lesson' | 'flashcards' | 'mistakes' | 'final-quiz' | 'audit' | 'exam-prep';
  setActiveTab: (tab: 'lesson' | 'flashcards' | 'mistakes' | 'final-quiz' | 'audit' | 'exam-prep') => void;
  mistakes: MistakeRecord[];
  onNewDocumentClick: () => void;
  completedSectionCount: number;
  onOpenMemo?: () => void;
  onOpenSettings?: () => void;
  onOpenFeedback?: () => void;
  onOpenPomodoro?: () => void;
  onOpenStudyPrep?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  course,
  activeTab,
  setActiveTab,
  mistakes,
  onNewDocumentClick,
  completedSectionCount,
  onOpenMemo,
  onOpenSettings,
  onOpenFeedback,
  onOpenPomodoro,
  onOpenStudyPrep,
}) => {
  const {
    theme,
    toggleTheme,
    textSize,
    increaseTextSize,
    decreaseTextSize,
    uiDensity,
    cycleUiDensity,
    t,
  } = useThemeAndText();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur border-b transition-colors w-full ${
        theme === 'academia'
          ? 'bg-[#FAF6EE]/95 dark:bg-[#191512]/95 border-[#E2D6C5] dark:border-[#382E25]'
          : 'bg-white/95 dark:bg-[#12151B]/95 border-zinc-200/80 dark:border-zinc-800'
      }`}
    >
      {/* Top Bar: Brand Logo & Top Controls */}
      <div
        className={`w-full px-3.5 sm:px-6 lg:px-8 border-b ${
          theme === 'academia'
            ? 'border-[#EAE0D0] dark:border-[#2C241D]'
            : 'border-zinc-100 dark:border-zinc-800/60'
        }`}
      >
        <div className="flex items-center justify-between h-14 sm:h-15 gap-2 sm:gap-4">
          {/* StudyMate Title & Brand */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <img
              src="/assets/aistudio/Glowing_Wings_and_Orbiting_Robot_bb9b728c.png"
              alt="StudyMate Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain shadow-xs border border-zinc-200/80 dark:border-zinc-700/80 bg-white"
            />
            <span
              className={`font-bold tracking-tight text-base sm:text-lg whitespace-nowrap ${
                theme === 'academia'
                  ? 'font-serif-scholar text-[#1E3A2F] dark:text-[#E8F0EC]'
                  : 'text-[#1A6EF0] dark:text-[#64B5F6]'
              }`}
            >
              StudyMate
            </span>
          </div>

          {/* Top Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Background Focus Audio Player (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center">
              <SessionAudioPlayer />
            </div>

            {/* Pomodoro Timer Compact Widget (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center">
              <PomodoroTimer compact={true} onOpenFull={onOpenPomodoro} />
            </div>

            {/* UI View Mode Button (Minimal UI / Compact / Classic) - decreases user stress and options */}
            <button
              type="button"
              onClick={cycleUiDensity}
              className={`h-8.5 sm:h-9 px-2.5 sm:px-3 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold border transition-all shadow-2xs cursor-pointer ${
                uiDensity === 'minimal'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 shadow-xs'
                  : uiDensity === 'compact'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200/80 dark:border-zinc-700/80'
              }`}
              title={`View Mode: ${
                uiDensity === 'minimal'
                  ? 'Minimal UI (Low-distraction calm reading mode)'
                  : uiDensity === 'compact'
                  ? 'Compact UI (Condensed layout)'
                  : 'Classic UI (Full overview)'
              }. Click to switch view.`}
              aria-label="Toggle UI view density"
            >
              <Layout className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span className="hidden xs:inline">
                {uiDensity === 'minimal' ? 'Minimal UI' : uiDensity === 'compact' ? 'Compact' : 'Classic'}
              </span>
            </button>

            {/* Desktop-only font scaling widget */}
            <div className="hidden sm:flex h-8.5 sm:h-9 items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl px-1 border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs">
              <button
                type="button"
                onClick={decreaseTextSize}
                disabled={textSize === 'normal'}
                className="w-6 h-6 sm:h-7 flex items-center justify-center text-xs font-bold rounded-lg text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors cursor-pointer"
                title="Decrease font size"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <span className="text-[10px] uppercase font-bold text-[#5F6573] dark:text-[#A6ACB9] px-1 tabular-nums leading-none">
                {textSize === 'normal' ? '1x' : textSize === 'large' ? '1.2x' : '1.4x'}
              </span>
              <button
                type="button"
                onClick={increaseTextSize}
                disabled={textSize === 'xlarge'}
                className="w-6 h-6 sm:h-7 flex items-center justify-center text-xs font-bold rounded-lg text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors cursor-pointer"
                title="Increase font size"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Dark / Light / Theme Toggle Button (Always accessible) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700/80 transition-colors shadow-2xs cursor-pointer"
              title={`Active Theme: ${theme}. Click to cycle themes`}
              aria-label="Cycle theme"
            >
              {theme === 'cosmic' || theme === 'high-contrast' ? (
                <Sun className="w-4 h-4 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 shrink-0" />
              )}
            </button>

            {/* Desktop Settings & About Creator */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="hidden sm:inline-flex h-8.5 sm:h-9 px-2.5 sm:px-3 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold border border-zinc-200/80 dark:border-zinc-700/80 bg-zinc-100 dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:border-[#1A6EF0] dark:hover:border-[#64B5F6] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                title="StudyMate Settings, ADHD Tools & About Creator"
                aria-label="Open Settings"
              >
                <Settings className="w-3.5 h-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                <span className="hidden md:inline leading-none">Settings</span>
              </button>
            )}

            {/* Desktop Memo 3D Companion Shortcut */}
            {onOpenMemo && (
              <button
                type="button"
                onClick={onOpenMemo}
                className="hidden sm:inline-flex h-8.5 sm:h-9 px-2.5 sm:px-3 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                title="Chat with Memo · Doubts & Configurations"
              >
                <span className="w-2 h-2 rounded-full bg-[#22D08B] animate-pulse shrink-0" />
                <span className="leading-none">Memo</span>
              </button>
            )}

            {/* Desktop Feedback Button */}
            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                className="hidden sm:inline-flex h-8.5 sm:h-9 px-2.5 sm:px-3 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100/80 dark:hover:bg-rose-900/40 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                title="Share suggestions & feedback"
                aria-label="Feedback"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                <span className="hidden md:inline leading-none">Feedback</span>
              </button>
            )}

            {/* New Document Button (Desktop & Mobile) */}
            {course && (
              <>
                {/* Mobile New Document Button */}
                <button
                  type="button"
                  onClick={onNewDocumentClick}
                  className="sm:hidden h-8.5 px-2.5 inline-flex items-center justify-center gap-1 rounded-xl text-xs font-semibold bg-[#1A6EF0] text-white hover:bg-[#1558C4] transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  title="Start a new course"
                  aria-label="New document"
                >
                  <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-none">New</span>
                </button>

                {/* Desktop New Document Button */}
                <button
                  type="button"
                  onClick={onNewDocumentClick}
                  className="hidden sm:inline-flex h-8.5 sm:h-9 px-3 sm:px-3.5 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold bg-[#1A6EF0] text-white hover:bg-[#1558C4] transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  title="Start a new course"
                >
                  <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-none">New document</span>
                </button>
              </>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden w-8.5 h-8.5 inline-flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700/80 transition-colors shadow-2xs cursor-pointer shrink-0"
              title={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4 shrink-0" /> : <Menu className="w-4 h-4 shrink-0" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Row: Course Views (Lessons, Flashcards, Review Mistakes, Final Quiz, Content Audit, Exam Prep) */}
      {course && (
        <div className="w-full bg-zinc-50/80 dark:bg-zinc-900/60 backdrop-blur-xs py-2 px-3 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <nav
            className="flex items-center gap-1.5 sm:gap-2 min-w-max mx-auto sm:justify-center"
            aria-label="Course views"
          >
            <button
              type="button"
              onClick={() => setActiveTab('lesson')}
              className={`h-8 sm:h-8.5 px-3 rounded-xl text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'lesson'
                  ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] border border-[#1A6EF0]/30 dark:border-[#64B5F6]/30 shadow-xs'
                  : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-none">{t.lessons}</span>
              <span className="text-[11px] opacity-75 font-normal tabular-nums leading-none">
                ({completedSectionCount}/{course.sections.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('flashcards')}
              className={`h-8 sm:h-8.5 px-3 rounded-xl text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] border border-[#1A6EF0]/30 dark:border-[#64B5F6]/30 shadow-xs'
                  : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-none">{t.flashcards}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mistakes')}
              className={`h-8 sm:h-8.5 px-3 rounded-xl text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'mistakes'
                  ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] border border-[#1A6EF0]/30 dark:border-[#64B5F6]/30 shadow-xs'
                  : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-none">{t.reviewMistakes}</span>
              {mistakes.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B5F55A] text-[#1F410B] tabular-nums leading-none">
                  {mistakes.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('final-quiz')}
              className={`h-8 sm:h-8.5 px-3 rounded-xl text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'final-quiz'
                  ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] border border-[#1A6EF0]/30 dark:border-[#64B5F6]/30 shadow-xs'
                  : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-none">{t.finalQuiz}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('exam-prep')}
              className={`h-8 sm:h-8.5 px-3 rounded-xl text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'exam-prep'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
              }`}
              title="Rapid Active-Recall & Fast Memorization Exam Drills"
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-none">{t.examPrep}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 uppercase tracking-wider">
                Fast
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`h-8 sm:h-8.5 px-3 rounded-xl text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] border border-[#1A6EF0]/30 dark:border-[#64B5F6]/30 shadow-xs'
                  : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-none">{t.contentAudit}</span>
            </button>
          </nav>
        </div>
      )}

      {/* Mobile Overlay Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-14 sm:hidden bg-black/40 backdrop-blur-xs z-40 animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Overlay Menu Drawer */}
          <div
            role="dialog"
            aria-label="Mobile Navigation Menu"
            className="fixed inset-x-0 top-14 sm:hidden z-50 bg-white/98 dark:bg-[#161A22]/98 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 space-y-3.5 max-h-[85vh] overflow-y-auto animate-fadeIn"
          >
            {/* Start New Document Button (Prominent) */}
            {course && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNewDocumentClick();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#1A6EF0] hover:bg-[#1558C4] text-white font-semibold text-sm flex items-center justify-between shadow-xs transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  <span>Start New Document</span>
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal">
                  Upload or Sample
                </span>
              </button>
            )}

            {/* Quick Tools Row (Font Scaling & Pomodoro) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Font scaling widget */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80">
                <span className="text-xs font-semibold text-[#5F6573] dark:text-[#A6ACB9]">Text Size</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={decreaseTextSize}
                    disabled={textSize === 'normal'}
                    className="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-lg text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease font size"
                  >
                    A-
                  </button>
                  <span className="text-[10px] font-bold text-[#1A6EF0] dark:text-[#64B5F6] px-0.5 tabular-nums">
                    {textSize === 'normal' ? '1x' : textSize === 'large' ? '1.2x' : '1.4x'}
                  </span>
                  <button
                    type="button"
                    onClick={increaseTextSize}
                    disabled={textSize === 'xlarge'}
                    className="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-lg text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                    aria-label="Increase font size"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Pomodoro Focus Open */}
              {onOpenPomodoro && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPomodoro();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pomodoro</span>
                  </span>
                  <span className="text-[10px] opacity-75 font-normal">Pacing</span>
                </button>
              )}
            </div>

            {/* Focus Audio Player Row in Mobile Drawer */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-xs font-semibold text-[#5F6573] dark:text-[#A6ACB9]">Focus Music</span>
              <SessionAudioPlayer />
            </div>

            {/* UI View Mode Row in Mobile Drawer */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-xs font-semibold text-[#5F6573] dark:text-[#A6ACB9]">View Mode</span>
              <button
                type="button"
                onClick={cycleUiDensity}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-700 text-[#1A6EF0] dark:text-[#64B5F6] border border-zinc-200/80 dark:border-zinc-600 shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <Layout className="w-3.5 h-3.5 opacity-80" />
                <span>{uiDensity === 'minimal' ? 'Minimal UI' : uiDensity === 'compact' ? 'Compact' : 'Classic'}</span>
              </button>
            </div>

            {/* Memo 3D Companion Shortcut in Mobile */}
            {onOpenMemo && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMemo();
                }}
                className="w-full text-left p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between cursor-pointer shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22D08B] animate-pulse shrink-0" />
                  <span>Ask Memo (3D Tutor Companion)</span>
                </span>
                <span className="text-[10px] opacity-75 font-normal">Chat</span>
              </button>
            )}

            {/* Settings & Creator Link */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full text-left p-3 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center justify-between hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Settings, ADHD & About Creator</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-normal">Hamza Rashid K</span>
              </button>
            )}

            {/* Mobile Feedback Link */}
            {onOpenFeedback && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFeedback();
                }}
                className="w-full text-left p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center justify-between hover:bg-rose-100/60 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-rose-500" />
                  <span>Share Feedback & Suggestions</span>
                </span>
                <span className="text-[10px] text-rose-400 font-medium">Improve</span>
              </button>
            )}

            {/* Course Views in Mobile Drawer */}
            {course && (
              <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1 block">
                  Course Views
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('lesson');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    activeTab === 'lesson'
                      ? 'bg-[#1A6EF0] text-white shadow-xs'
                      : 'text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lessons</span>
                  </span>
                  <span className="text-[11px] opacity-80 tabular-nums">
                    {completedSectionCount}/{course.sections.length} done
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('flashcards');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    activeTab === 'flashcards'
                      ? 'bg-[#1A6EF0] text-white shadow-xs'
                      : 'text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Flashcards</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('mistakes');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    activeTab === 'mistakes'
                      ? 'bg-[#1A6EF0] text-white shadow-xs'
                      : 'text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Review Mistakes</span>
                  </span>
                  {mistakes.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B5F55A] text-[#1F410B] tabular-nums">
                      {mistakes.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('final-quiz');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    activeTab === 'final-quiz'
                      ? 'bg-[#1A6EF0] text-white shadow-xs'
                      : 'text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    <span>Final Quiz</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('exam-prep');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    activeTab === 'exam-prep'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Exam Prep (Fast Memorization)</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 uppercase">
                    Drills
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('audit');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    activeTab === 'audit'
                      ? 'bg-[#1A6EF0] text-white shadow-xs'
                      : 'text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Content Audit</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};
