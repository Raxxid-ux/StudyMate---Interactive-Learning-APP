/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Right-Side Companion & Section Navigator Panel
 * Provides a dedicated, full-height right panel on desktop with tabs for:
 * 1. Course Sections & Progress (extends fully to bottom)
 * 2. Interactive 3D Memo Companion
 * 3. Current Section Key Notes & Glossary
 * Plus an expandable dropdown selector on mobile screens.
 */

import React, { useState } from 'react';
import {
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  BookOpen,
  MessageSquare,
  FileText,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Layers,
} from './icons.tsx';
import type { CourseData } from '../types.ts';
import { MemoThreeCanvas } from './MemoThreeCanvas.tsx';

interface SidebarProps {
  course: CourseData;
  currentSectionIndex: number;
  onSelectSection: (index: number) => void;
  completedSectionIndices: number[];
  onRetrySection: (index: number) => void;
  onOpenMemo?: () => void;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  course,
  currentSectionIndex,
  onSelectSection,
  completedSectionIndices,
  onRetrySection,
  onOpenMemo,
  mobileOnly = false,
  desktopOnly = false,
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'memo' | 'notes'>('sections');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const totalSections = course.sections.length;
  const readySections = course.sections.filter((s) => s.status === 'ready').length;
  const completedCount = completedSectionIndices.length;
  const percentCompleted = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  // Next section to do is the first uncompleted section that is ready
  const nextDoableIndex = course.sections.findIndex(
    (s, idx) => s.status === 'ready' && !completedSectionIndices.includes(idx)
  );

  const currentSection = course.sections[currentSectionIndex];
  const lesson = currentSection?.lesson;
  const keyPoints = lesson?.keyPoints || [];
  const glossary = lesson?.glossary || [];
  const steps = lesson?.steps || [];

  // =========================================================================
  // MOBILE VIEW: Collapsible Dropdown Selector (top of screen on mobile)
  // =========================================================================
  const renderMobileView = () => (
    <div className="lg:hidden w-full bg-[#F9FAFC] dark:bg-[#161A22] border-b border-zinc-200/80 dark:border-zinc-800 shrink-0">
      {/* Compact dropdown trigger bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="flex-1 flex items-center justify-between gap-2.5 text-left min-w-0 p-1 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
          aria-expanded={mobileExpanded}
          aria-label="Toggle lesson selection dropdown"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1A6EF0] text-white">
              Lesson {currentSectionIndex + 1}/{totalSections}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] truncate">
              {currentSection?.title || 'Choose a lesson'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-[#1A6EF0] dark:text-[#64B5F6]">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              {percentCompleted}%
            </span>
            {mobileExpanded ? (
              <ChevronUp className="w-4 h-4 shrink-0 text-zinc-600 dark:text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 shrink-0 text-zinc-600 dark:text-zinc-400" />
            )}
          </div>
        </button>
      </div>

      {/* Expandable dropdown body */}
      {mobileExpanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-zinc-200/60 dark:border-zinc-800/60 animate-fadeIn">
          {/* Progress Bar in dropdown */}
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#5F6573] dark:text-[#A6ACB9]">
              <span>Course Progress</span>
              <span className="tabular-nums">
                {completedCount} of {totalSections} lessons completed ({percentCompleted}%)
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1A6EF0] h-full transition-all duration-300 rounded-full"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>
          </div>

          {/* Lessons List in dropdown */}
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {course.sections.map((section, idx) => {
              const isSelected = currentSectionIndex === idx;
              const isCompleted = completedSectionIndices.includes(idx);
              const isNextDoable = idx === nextDoableIndex;
              const isReady = section.status === 'ready';

              let chipBg = 'bg-[#E3E6EC] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
              let chipLabel = 'Not ready';

              if (isCompleted) {
                chipBg = 'bg-[#A8C7FA] text-[#0A387E]';
                chipLabel = 'Completed';
              } else if (isNextDoable) {
                chipBg = 'bg-[#B5F55A] text-[#1F410B]';
                chipLabel = 'Up next';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (isReady) {
                      onSelectSection(idx);
                      setMobileExpanded(false);
                    }
                  }}
                  disabled={!isReady}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 border border-[#1A6EF0] shadow-xs'
                      : 'hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${chipBg}`}>
                      Lesson {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] truncate">
                      {section.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-[#5F6573] dark:text-[#A6ACB9]">
                      {chipLabel}
                    </span>
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-[#1A6EF0] shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Collapse action button */}
          <div className="pt-1 flex justify-center">
            <button
              type="button"
              onClick={() => setMobileExpanded(false)}
              className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-[#1A6EF0] inline-flex items-center gap-1 cursor-pointer py-1"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Close lesson list</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // =========================================================================
  // DESKTOP VIEW: Dedicated Full-Height Left Panel
  // =========================================================================
  const renderDesktopView = () => {
    // Collapsed rail state
    if (isCollapsed) {
      return (
        <aside
          className="hidden lg:flex w-14 shrink-0 bg-[#F9FAFC] dark:bg-[#161A22] border-r border-zinc-200/80 dark:border-zinc-800 flex-col items-center py-4 justify-between h-full transition-all select-none"
          aria-label="Collapsed study tools panel"
        >
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Expand button (points right into main content) */}
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-[#1A6EF0] dark:text-[#64B5F6] flex items-center justify-center hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Expand left panel"
              aria-label="Expand left panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Quick-switch tab icon buttons */}
            <div className="flex flex-col items-center gap-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800 w-full px-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('sections');
                  setIsCollapsed(false);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  activeTab === 'sections'
                    ? 'bg-[#1A6EF0] text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
                title="Course Sections"
              >
                <BookOpen className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('memo');
                  setIsCollapsed(false);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer relative ${
                  activeTab === 'memo'
                    ? 'bg-[#1A6EF0] text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
                title="3D Memo Companion"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#22D08B]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('notes');
                  setIsCollapsed(false);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-[#1A6EF0] text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
                title="Section Key Points & Glossary"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom mini progress indicator */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tabular-nums">
              {percentCompleted}%
            </span>
            <div className="w-1.5 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex flex-col justify-end">
              <div
                className="bg-[#1A6EF0] w-full transition-all duration-300 rounded-full"
                style={{ height: `${percentCompleted}%` }}
              />
            </div>
          </div>
        </aside>
      );
    }

    // Expanded full-height left panel
    return (
      <aside
        className="hidden lg:flex w-84 xl:w-92 2xl:w-96 shrink-0 bg-[#F9FAFC] dark:bg-[#161A22] border-r border-zinc-200/80 dark:border-zinc-800 flex-col h-full overflow-hidden transition-all shadow-xs"
        aria-label="StudyMate left companion panel"
      >
        {/* Header Tabs Strip */}
        <div className="p-3 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xs shrink-0 flex items-center justify-between gap-2">
          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100/90 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 flex-1">
            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'sections'
                  ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-2xs'
                  : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Sections</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('memo')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'memo'
                  ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-2xs'
                  : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Memo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-2xs'
                  : 'text-[#5F6573] dark:text-[#A6ACB9] hover:text-[#3A3F4F] dark:hover:text-[#F1F3F7]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Notes</span>
            </button>
          </div>

          {/* Collapse Panel Button (points left to collapse towards left border) */}
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Collapse left panel"
            aria-label="Collapse left panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: SECTIONS & COURSE PROGRESS */}
        {activeTab === 'sections' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Top Progress Overview */}
            <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800 space-y-2.5 shrink-0 bg-white/40 dark:bg-zinc-900/30">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5F6573] dark:text-[#A6ACB9]">
                <span className="uppercase tracking-wider">Course Progress</span>
                <span className="tabular-nums">
                  {completedCount} of {totalSections} ({percentCompleted}%)
                </span>
              </div>

              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#1A6EF0] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>

              {readySections < totalSections && (
                <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-2 text-xs text-[#5CC83A]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span className="font-medium text-[11px]">
                    Building lesson {readySections + 1} of {totalSections}...
                  </span>
                </div>
              )}
            </div>

            {/* Sections List - Scrolls fully and extends to bottom */}
            <nav className="flex-1 overflow-y-auto p-3.5 space-y-2" aria-label="Course lessons">
              {course.sections.map((section, idx) => {
                const isSelected = currentSectionIndex === idx;
                const isCompleted = completedSectionIndices.includes(idx);
                const isNextDoable = idx === nextDoableIndex;
                const isReady = section.status === 'ready';
                const isBuilding = section.status === 'building';
                const isError = section.status === 'error';

                let chipBg = 'bg-[#E3E6EC] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
                let chipLabel = 'Not ready';

                if (isCompleted) {
                  chipBg = 'bg-[#A8C7FA] text-[#0A387E]';
                  chipLabel = 'Completed';
                } else if (isNextDoable) {
                  chipBg = 'bg-[#B5F55A] text-[#1F410B]';
                  chipLabel = 'Up next';
                } else if (isBuilding) {
                  chipBg = 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200';
                  chipLabel = 'Building';
                }

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl transition-all border ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-900 border-[#1A6EF0] shadow-xs'
                        : 'bg-transparent hover:bg-white/60 dark:hover:bg-zinc-900/40 border-transparent'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isReady) onSelectSection(idx);
                      }}
                      disabled={!isReady}
                      className="w-full text-left p-3 flex items-start justify-between gap-3 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${chipBg}`}
                          >
                            Lesson {idx + 1}
                          </span>
                          <span className="text-[10px] text-[#5F6573] dark:text-[#A6ACB9]">
                            {chipLabel}
                          </span>
                        </div>

                        <h4
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isSelected
                              ? 'text-[#1A6EF0]'
                              : isReady
                              ? 'text-[#3A3F4F] dark:text-[#F1F3F7]'
                              : 'text-zinc-400 dark:text-zinc-600'
                          }`}
                          title={section.title}
                        >
                          {section.title}
                        </h4>
                      </div>

                      {isReady && (
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 mt-1.5 transition-transform ${
                            isSelected ? 'text-[#1A6EF0] translate-x-0.5' : 'text-zinc-400'
                          }`}
                        />
                      )}
                    </button>

                    {isError && (
                      <div className="px-3 pb-3 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRetrySection(idx);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 hover:opacity-90 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" /> Retry lesson {idx + 1}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        )}

        {/* TAB 2: INTERACTIVE 3D MEMO COMPANION */}
        {activeTab === 'memo' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
            {/* Live 3D Memo Canvas Card */}
            <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col items-center text-center space-y-2">
              <div className="w-full h-44 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1A6EF0]/5 via-white to-emerald-50/20 dark:from-[#12151B] dark:to-[#161A22] border border-zinc-100 dark:border-zinc-800 relative">
                <MemoThreeCanvas
                  mood="idle"
                  interactive={true}
                  className="w-full h-full"
                  size="medium"
                  soundEnabled={true}
                />
              </div>

              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Interactive 3D Stylus</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Memo Companion
                </h4>
                <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                  Tap Memo anytime to spin, react, and clarify doubts.
                </p>
              </div>
            </div>

            {/* Quick Prompts to ask Memo */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">
                Quick Inquiries
              </span>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={onOpenMemo}
                  className="w-full text-left p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-[#1A6EF0]/50 hover:bg-[#1A6EF0]/5 transition-all text-xs font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center justify-between cursor-pointer group shadow-2xs"
                >
                  <span>Summarize this lesson</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#1A6EF0] transition-colors" />
                </button>

                <button
                  type="button"
                  onClick={onOpenMemo}
                  className="w-full text-left p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-[#1A6EF0]/50 hover:bg-[#1A6EF0]/5 transition-all text-xs font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center justify-between cursor-pointer group shadow-2xs"
                >
                  <span>Explain with a real-life analogy</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#1A6EF0] transition-colors" />
                </button>

                <button
                  type="button"
                  onClick={onOpenMemo}
                  className="w-full text-left p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-[#1A6EF0]/50 hover:bg-[#1A6EF0]/5 transition-all text-xs font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center justify-between cursor-pointer group shadow-2xs"
                >
                  <span>Verify quotes against original text</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#1A6EF0] transition-colors" />
                </button>
              </div>
            </div>

            {/* Open Full Chat button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenMemo}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1A6EF0] hover:bg-[#1558C4] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Full Memo Chat</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: KEY POINTS & GLOSSARY */}
        {activeTab === 'notes' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Key Points */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1A6EF0] dark:text-[#64B5F6]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Key Takeaways</span>
              </div>

              {keyPoints.length > 0 ? (
                <div className="space-y-2">
                  {keyPoints.map((point, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-[#3A3F4F] dark:text-[#F1F3F7] leading-relaxed shadow-2xs flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A6EF0] shrink-0 mt-1.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9] italic p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                  Key points for this lesson will appear here as you read.
                </p>
              )}
            </div>

            {/* Glossary Terms */}
            {glossary.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Glossary ({glossary.length})</span>
                </div>

                <div className="space-y-2">
                  {glossary.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1 shadow-2xs"
                    >
                      <div className="text-xs font-bold text-[#1A6EF0] dark:text-[#64B5F6]">
                        {item.term}
                      </div>
                      <div className="text-xs text-[#5F6573] dark:text-[#A6ACB9] leading-relaxed">
                        {item.definition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps Breakdown */}
            {steps.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Process Steps ({steps.length})</span>
                </div>

                <div className="space-y-2">
                  {steps.map((st, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2 shadow-2xs"
                    >
                      <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                        {st.title}
                      </div>
                      <div className="space-y-1.5 pl-2 border-l border-amber-200 dark:border-amber-900/60">
                        {st.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="text-xs">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {item.label}:
                            </span>{' '}
                            <span className="text-[#5F6573] dark:text-[#A6ACB9]">
                              {item.detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    );
  };

  // Selective rendering based on mode
  if (mobileOnly) return renderMobileView();
  if (desktopOnly) return renderDesktopView();

  return (
    <>
      {renderMobileView()}
      {renderDesktopView()}
    </>
  );
};
