/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, Clock, RefreshCw, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import type { CourseData } from '../types.ts';

interface SidebarProps {
  course: CourseData;
  currentSectionIndex: number;
  onSelectSection: (index: number) => void;
  completedSectionIndices: number[];
  onRetrySection: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  course,
  currentSectionIndex,
  onSelectSection,
  completedSectionIndices,
  onRetrySection,
}) => {
  const totalSections = course.sections.length;
  const readySections = course.sections.filter((s) => s.status === 'ready').length;
  const completedCount = completedSectionIndices.length;
  const percentCompleted = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  // Next section to do is the first uncompleted section that is ready
  const nextDoableIndex = course.sections.findIndex(
    (s, idx) => s.status === 'ready' && !completedSectionIndices.includes(idx)
  );

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-[#F9FAFC] dark:bg-[#1A1E27] border-r border-zinc-200/80 dark:border-zinc-800 flex flex-col h-full">
      {/* Top Progress Overview */}
      <div className="p-5 border-b border-zinc-200/80 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[#5F6573] dark:text-[#A6ACB9]">
          <span className="uppercase tracking-wider">Course Progress</span>
          <span>
            {completedCount} of {totalSections} completed ({percentCompleted}%)
          </span>
        </div>

        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#1A6EF0] h-full transition-all duration-300 rounded-full"
            style={{ width: `${percentCompleted}%` }}
          />
        </div>

        {readySections < totalSections && (
          <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-2 text-xs text-[#5CC83A]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span className="font-medium">
              Building lesson {readySections + 1} of {totalSections}...
            </span>
          </div>
        )}
      </div>

      {/* Sections List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2" aria-label="Course lessons">
        {course.sections.map((section, idx) => {
          const isSelected = currentSectionIndex === idx;
          const isCompleted = completedSectionIndices.includes(idx);
          const isNextDoable = idx === nextDoableIndex;
          const isReady = section.status === 'ready';
          const isBuilding = section.status === 'building';
          const isError = section.status === 'error';

          // Chip colors:
          // Light blue #A8C7FA = finished
          // Lime #B5F55A = can do next
          // Gray #E3E6EC = locked/not yet
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
                  ? 'bg-white dark:bg-zinc-900 border-[#1A6EF0] shadow-sm'
                  : 'bg-transparent hover:bg-white/60 dark:hover:bg-zinc-900/40 border-transparent'
              }`}
            >
              <button
                onClick={() => {
                  if (isReady) onSelectSection(idx);
                }}
                disabled={!isReady}
                className="w-full text-left p-3.5 flex items-start justify-between gap-3 disabled:cursor-not-allowed cursor-pointer"
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
                    className={`text-sm font-semibold truncate ${
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
                    className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                      isSelected ? 'text-[#1A6EF0] translate-x-0.5' : 'text-zinc-400'
                    }`}
                  />
                )}
              </button>

              {isError && (
                <div className="px-3 pb-3 flex justify-end">
                  <button
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
    </aside>
  );
};
