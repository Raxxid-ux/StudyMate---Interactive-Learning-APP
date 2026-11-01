/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Library View
 * Document management, multi-file inspection, extracted notes, and course switching.
 */

import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
} from './icons.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { CourseData } from '../types.ts';

interface LibraryViewProps {
  course: CourseData;
  onNewDocumentClick: () => void;
  onSelectSection: (sectionIndex: number) => void;
  onOpenAudit: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  course,
  onNewDocumentClick,
  onSelectSection,
  onOpenAudit,
}) => {
  const { theme } = useThemeAndText();
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'skipped'>('overview');

  const allKeyPoints = course.sections.flatMap((s, idx) =>
    (s.lesson?.keyPoints || []).map((kp, kpIdx) => ({
      id: `${idx}-${kpIdx}`,
      text: kp,
      sectionIndex: idx,
      sectionTitle: s.title,
    }))
  );

  const allGlossary = course.sections.flatMap((s, idx) =>
    (s.lesson?.glossary || []).map((g) => ({ ...g, sectionIndex: idx, sectionTitle: s.title }))
  );

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Document Library
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Active documents & notes
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
            {course.documentTitle}
          </h1>
        </div>

        <button
          type="button"
          onClick={onNewDocumentClick}
          className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs shrink-0 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>Upload New Course</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200/60 dark:border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#1A6EF0] text-white shadow-2xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Document Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-[#1A6EF0] text-white shadow-2xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Course Notes ({allKeyPoints.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('skipped')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'skipped'
              ? 'bg-[#1A6EF0] text-white shadow-2xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Skipped Filler ({course.skippedContent?.length || 0})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Metadata Card */}
          <div
            className={`p-6 rounded-3xl border transition-all space-y-4 ${
              theme === 'academia'
                ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E2D6C5] dark:border-[#3E342B]'
                : 'bg-white dark:bg-[#1A1E27] border-zinc-200/80 dark:border-zinc-800'
            }`}
          >
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Active Course Curriculum
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Lessons</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {course.sections.length}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Ready Lessons</span>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  {course.sections.filter((s) => s.status === 'ready').length}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Key Concepts</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {allKeyPoints.length}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Vocabulary</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {allGlossary.length}
                </span>
              </div>
            </div>

            {/* Lessons Quick Jump List */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                Jump to Lesson
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {course.sections.map((sec, idx) => (
                  <button
                    key={sec.sectionIndex}
                    type="button"
                    onClick={() => onSelectSection(idx)}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-[#006A4E] dark:hover:border-emerald-600 bg-white/60 dark:bg-zinc-800/40 text-left flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#006A4E] dark:text-emerald-400">
                        Lesson {idx + 1}
                      </div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {sec.title}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Want to verify exact citations and omitted content?
              </span>
              <button
                type="button"
                onClick={onOpenAudit}
                className="text-xs font-semibold text-[#006A4E] dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Inspect Content Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {allKeyPoints.map((kp, idx) => (
            <div
              key={kp.id || idx}
              className="p-4 rounded-2xl bg-white dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span className="font-bold text-[#006A4E] dark:text-emerald-400 uppercase tracking-wider">
                  Lesson {kp.sectionIndex + 1}: {kp.sectionTitle}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
                {kp.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skipped Filler Tab */}
      {activeTab === 'skipped' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            De-noised Filler & Metadata
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            These lines were stripped during curriculum cleaning to prevent cognitive noise (headers, footers, page numbers).
          </p>

          <div className="space-y-1.5 pt-2 max-h-96 overflow-y-auto">
            {(course.skippedContent || []).length > 0 ? (
              course.skippedContent.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 truncate"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic">No extraneous filler detected.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
