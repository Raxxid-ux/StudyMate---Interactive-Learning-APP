/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Moon, Sun, PlusCircle, AlertCircle, Layers, Award, FileSpreadsheet, Menu, X, Sparkles } from 'lucide-react';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { CourseData, MistakeRecord } from '../types.ts';

interface NavbarProps {
  course: CourseData | null;
  activeTab: 'lesson' | 'flashcards' | 'mistakes' | 'final-quiz' | 'audit';
  setActiveTab: (tab: 'lesson' | 'flashcards' | 'mistakes' | 'final-quiz' | 'audit') => void;
  mistakes: MistakeRecord[];
  onNewDocumentClick: () => void;
  completedSectionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  course,
  activeTab,
  setActiveTab,
  mistakes,
  onNewDocumentClick,
  completedSectionCount,
}) => {
  const { theme, toggleTheme, textSize, increaseTextSize, decreaseTextSize } = useThemeAndText();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#EDF0F5]/90 dark:bg-[#12151B]/90 backdrop-blur border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Neutral Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1A6EF0] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] tracking-tight text-base sm:text-lg">
                Your Course
              </span>
              <span className="hidden sm:inline-block border border-zinc-400/40 text-[9px] tracking-widest font-semibold uppercase px-2 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
                STUDY DRAFT
              </span>
            </div>
          </div>

          {/* Navigation Tabs (if course loaded) */}
          {course && (
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Course views">
              <button
                onClick={() => setActiveTab('lesson')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'lesson'
                    ? 'bg-[#1A6EF0] text-white shadow-xs'
                    : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Lessons</span>
                <span className="text-xs opacity-80">
                  ({completedSectionCount}/{course.sections.length})
                </span>
              </button>

              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'flashcards'
                    ? 'bg-[#1A6EF0] text-white shadow-xs'
                    : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Flashcards</span>
              </button>

              <button
                onClick={() => setActiveTab('mistakes')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'mistakes'
                    ? 'bg-[#1A6EF0] text-white shadow-xs'
                    : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Review Mistakes</span>
                {mistakes.length > 0 && (
                  <span className="px-2 py-0.2 rounded-full text-[11px] font-bold bg-[#B5F55A] text-[#1F410B]">
                    {mistakes.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('final-quiz')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'final-quiz'
                    ? 'bg-[#1A6EF0] text-white shadow-xs'
                    : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Final Quiz</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'audit'
                    ? 'bg-[#1A6EF0] text-white shadow-xs'
                    : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7] hover:bg-white/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Content Audit</span>
              </button>
            </nav>
          )}

          {/* Right utility buttons: Text size, Theme, New doc */}
          <div className="flex items-center gap-2">
            {/* Font scaling */}
            <div className="flex items-center bg-white dark:bg-zinc-800 rounded-xl p-0.5 border border-zinc-200/80 dark:border-zinc-700 shadow-2xs">
              <button
                onClick={decreaseTextSize}
                disabled={textSize === 'normal'}
                className="px-2 py-1 text-xs font-bold rounded-lg text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors cursor-pointer"
                title="Decrease font size"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <span className="text-[10px] uppercase font-semibold text-[#5F6573] dark:text-[#A6ACB9] px-1">
                {textSize === 'normal' ? '1x' : textSize === 'large' ? '1.2x' : '1.4x'}
              </span>
              <button
                onClick={increaseTextSize}
                disabled={textSize === 'xlarge'}
                className="px-2 py-1 text-xs font-bold rounded-lg text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors cursor-pointer"
                title="Increase font size"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Dark / Light Mode */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* New Document Button */}
            {course && (
              <button
                onClick={onNewDocumentClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer shadow-2xs"
                title="Start a new course"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New document</span>
              </button>
            )}

            {/* Mobile menu button */}
            {course && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#3A3F4F] dark:text-[#F1F3F7] hover:bg-white/60"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        {course && mobileMenuOpen && (
          <div className="lg:hidden py-3 px-2 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-1.5 bg-[#EDF0F5] dark:bg-[#12151B]">
            <button
              onClick={() => {
                setActiveTab('lesson');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                activeTab === 'lesson'
                  ? 'bg-[#1A6EF0] text-white'
                  : 'text-[#3A3F4F] dark:text-[#F1F3F7]'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Lessons
              </span>
              <span className="text-xs opacity-80">
                {completedSectionCount}/{course.sections.length} done
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('flashcards');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
                activeTab === 'flashcards'
                  ? 'bg-[#1A6EF0] text-white'
                  : 'text-[#3A3F4F] dark:text-[#F1F3F7]'
              }`}
            >
              <Layers className="w-4 h-4" /> Flashcards
            </button>

            <button
              onClick={() => {
                setActiveTab('mistakes');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                activeTab === 'mistakes'
                  ? 'bg-[#1A6EF0] text-white'
                  : 'text-[#3A3F4F] dark:text-[#F1F3F7]'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Review Mistakes
              </span>
              {mistakes.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#B5F55A] text-[#1F410B]">
                  {mistakes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('final-quiz');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
                activeTab === 'final-quiz'
                  ? 'bg-[#1A6EF0] text-white'
                  : 'text-[#3A3F4F] dark:text-[#F1F3F7]'
              }`}
            >
              <Award className="w-4 h-4" /> Final Quiz
            </button>

            <button
              onClick={() => {
                setActiveTab('audit');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
                activeTab === 'audit'
                  ? 'bg-[#1A6EF0] text-white'
                  : 'text-[#3A3F4F] dark:text-[#F1F3F7]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" /> Content Audit
            </button>

            <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNewDocumentClick();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Start New Document
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
