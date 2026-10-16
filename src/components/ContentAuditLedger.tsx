/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileSpreadsheet, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Sparkles, Layers } from 'lucide-react';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { CourseData } from '../types.ts';

interface ContentAuditLedgerProps {
  course: CourseData;
}

export const ContentAuditLedger: React.FC<ContentAuditLedgerProps> = ({ course }) => {
  const { fontSizeClass } = useThemeAndText();

  // Combine document-level skipped items and section-level skipped items
  const allSkippedItems: string[] = [...(course.skippedContent || [])];
  course.sections.forEach((sec) => {
    if (sec.lesson?.skippedItems) {
      sec.lesson.skippedItems.forEach((item) => {
        allSkippedItems.push(`Lesson ${sec.sectionIndex + 1} ("${sec.title}"): ${item}`);
      });
    }
  });

  const nothingSkipped = allSkippedItems.length === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 pb-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-[#1A6EF0]" />
            <h1 className="text-3xl font-light text-[#3A3F4F] dark:text-[#F1F3F7] tracking-tight">
              Content Audit
            </h1>
          </div>
          <span className="border border-zinc-400/40 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded text-zinc-500">
            STUDY DRAFT
          </span>
        </div>
        <p className="text-sm text-[#5F6573] dark:text-[#A6ACB9]">
          Audit report: lesson titles built, which document topics were merged, and the skipped content log.
        </p>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#F9FAFC] dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-semibold text-[#5F6573] dark:text-[#A6ACB9] uppercase tracking-wider">
            Your Document
          </span>
          <p className="font-semibold text-sm sm:text-base text-[#3A3F4F] dark:text-[#F1F3F7] truncate" title={course.documentTitle}>
            {course.documentTitle}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#F9FAFC] dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-semibold text-[#5F6573] dark:text-[#A6ACB9] uppercase tracking-wider">
            Sections Built
          </span>
          <p className="font-bold text-xl text-[#1A6EF0]">
            {course.sections.length} Lessons
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#F9FAFC] dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] font-semibold text-[#5F6573] dark:text-[#A6ACB9] uppercase tracking-wider">
            Skipped Content
          </span>
          <p className={`font-bold text-xl ${nothingSkipped ? 'text-[#22D08B]' : 'text-amber-600'}`}>
            {nothingSkipped ? '0 Items Omitted' : `${allSkippedItems.length} Logged Items`}
          </p>
        </div>
      </div>

      {/* 1. Section Titles Built and Merged Document Parts */}
      <section className="space-y-4" aria-label="Section titles and merged parts">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#1A6EF0]" />
          <h2 className="text-lg font-medium text-[#3A3F4F] dark:text-[#F1F3F7]">
            Section Titles Built & Merged Document Parts
          </h2>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden bg-[#F9FAFC] dark:bg-[#1A1E27] divide-y divide-zinc-200/80 dark:divide-zinc-800">
          {course.sections.map((sec, idx) => (
            <div key={idx} className="p-5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1A6EF0]/10 text-[#1A6EF0]">
                    Lesson {idx + 1}
                  </span>
                  <h3 className="font-semibold text-sm sm:text-base text-[#3A3F4F] dark:text-[#F1F3F7]">
                    {sec.title}
                  </h3>
                </div>
                <span className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                  {sec.content.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              {/* Merged Parts list */}
              {sec.mergedParts && sec.mergedParts.length > 0 && (
                <div className="pl-2 pt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                  <span className="text-[11px] font-medium">Merged document parts:</span>
                  {sec.mergedParts.map((part, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-[11px] text-[#3A3F4F] dark:text-[#F1F3F7]"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. Skipped Content Log or First/Last Sentences */}
      <section className="space-y-4" aria-label="Skipped content log">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#22D08B]" />
          <h2 className="text-lg font-medium text-[#3A3F4F] dark:text-[#F1F3F7]">
            Skipped Content Log
          </h2>
        </div>

        {!nothingSkipped ? (
          <div className="space-y-3">
            <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
              The following elements were omitted during reading and code verification:
            </p>
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-[#F9FAFC] dark:bg-[#1A1E27] divide-y divide-zinc-200/80 dark:divide-zinc-800 p-2">
              {allSkippedItems.map((item, sIdx) => (
                <div key={sIdx} className="p-3.5 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#3A3F4F] dark:text-[#F1F3F7]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F9FAFC] dark:bg-[#1A1E27] border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-[#1F410B] dark:text-[#B5F55A] text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-[#22D08B]" />
              <span>Nothing was skipped in this document.</span>
            </div>
            <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
              Verified first and last sentences of your document:
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5F6573] dark:text-[#A6ACB9] block">
                  First Sentence of Document (Exact)
                </span>
                <p className={`text-[#3A3F4F] dark:text-[#F1F3F7] italic ${fontSizeClass}`}>
                  "{course.firstSentence || course.sections[0]?.content.split('.')[0] + '.'}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5F6573] dark:text-[#A6ACB9] block">
                  Last Sentence of Document (Exact)
                </span>
                <p className={`text-[#3A3F4F] dark:text-[#F1F3F7] italic ${fontSizeClass}`}>
                  "{course.lastSentence || course.sections[course.sections.length - 1]?.content.trim().split('.').slice(-2, -1)[0]?.trim() + '.'}"
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
