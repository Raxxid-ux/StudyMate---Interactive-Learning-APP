/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Study Readiness & Preparation Guide
 * Psychologically grounding checklist that prepares students for distraction-free learning.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Headphones,
  Volume2,
  ArrowRight,
  BookOpen,
  Coffee,
  Check,
} from './icons.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import { playCalmChime, playSoftTap } from '../utils/audioChimes.ts';

interface StudyGuidePrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartStudy: () => void;
  documentTitle?: string;
}

export const StudyGuidePrepModal: React.FC<StudyGuidePrepModalProps> = ({
  isOpen,
  onClose,
  onStartStudy,
  documentTitle,
}) => {
  const { t, language, theme } = useThemeAndText();
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1]); // initial encouragement

  if (!isOpen) return null;

  const steps = [
    {
      id: 0,
      title: t.prepStep1Title,
      desc: t.prepStep1Desc,
      icon: 'space',
    },
    {
      id: 1,
      title: t.prepStep2Title,
      desc: t.prepStep2Desc,
      icon: 'headphones',
    },
    {
      id: 2,
      title: t.prepStep3Title,
      desc: t.prepStep3Desc,
      icon: 'water',
    },
    {
      id: 3,
      title: t.prepStep4Title,
      desc: t.prepStep4Desc,
      icon: 'silent',
    },
    {
      id: 4,
      title: t.prepStep5Title,
      desc: t.prepStep5Desc,
      icon: 'breath',
    },
  ];

  const toggleStep = (id: number) => {
    playSoftTap(true);
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const allCompleted = completedSteps.length === steps.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prep-title"
    >
      <div
        className={`w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] ${
          theme === 'academia'
            ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E2D6C5] dark:border-[#3E342B] text-[#2B231D] dark:text-[#F3EAE0]'
            : 'bg-white dark:bg-[#1A1E27] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4.5 border-b flex items-center justify-between shrink-0 ${
            theme === 'academia'
              ? 'bg-[#EFE9DC] dark:bg-[#181410] border-[#E2D6C5] dark:border-[#3E342B]'
              : 'bg-gradient-to-r from-blue-50/60 to-emerald-50/60 dark:from-slate-800/60 dark:to-slate-800/40 border-slate-100 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                theme === 'academia'
                  ? 'bg-[#C5A059]/20 text-[#8C6239] dark:text-[#E6C687]'
                  : 'bg-[#1A6EF0]/10 text-[#1A6EF0] dark:text-[#64B5F6]'
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="prep-title"
                className={`font-semibold text-base tracking-tight leading-tight ${
                  theme === 'academia' ? 'font-serif-scholar text-lg font-bold' : ''
                }`}
              >
                {t.studyPrepTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                {documentTitle ? `${documentTitle}` : t.studyPrepSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300/80 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close preparation guide"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div
            className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-center gap-2.5 ${
              theme === 'academia'
                ? 'bg-[#F2ECE1] dark:bg-[#251F18] border-[#DECFC0] dark:border-[#3D3328] text-[#4A3B2F] dark:text-[#E2D5C3]'
                : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/40 text-blue-900 dark:text-blue-200'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0 text-[#C5A059] dark:text-[#E6C687]" />
            <span>
              {language === 'ml'
                ? 'പഠനം ആരംഭിക്കുന്നതിന് മുൻപ് ഈ 5 കാര്യങ്ങൾ ഉറപ്പാക്കൂ. നിങ്ങളുടെ ശ്രദ്ധ കൂട്ടാൻ ഇത് സഹായിക്കും.'
                : 'Taking 30 seconds to set up your environment primes your brain for effortless focus.'}
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {steps.map((st, idx) => {
              const isChecked = completedSteps.includes(st.id);
              return (
                <div
                  key={st.id}
                  onClick={() => toggleStep(st.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? theme === 'academia'
                        ? 'bg-[#EDE4D5] dark:bg-[#2A231B] border-[#C5A059]/60 shadow-xs'
                        : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 shadow-xs'
                      : 'bg-white/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isChecked
                          ? theme === 'academia'
                            ? 'bg-[#8C6239] text-[#F9F6EE]'
                            : 'bg-[#22D08B] text-white'
                          : 'border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isChecked
                            ? theme === 'academia'
                              ? 'text-[#5E442B] dark:text-[#E6C687]'
                              : 'text-emerald-900 dark:text-emerald-200'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {st.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        Step {idx + 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div
          className={`px-5 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
            theme === 'academia'
              ? 'bg-[#EFE9DC] dark:bg-[#181410] border-[#E2D6C5] dark:border-[#3E342B]'
              : 'bg-slate-50 dark:bg-[#161922] border-slate-100 dark:border-slate-800'
          }`}
        >
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>
              {completedSteps.length} of {steps.length} checks ready
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                playCalmChime(true);
                onStartStudy();
                onClose();
              }}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                theme === 'academia'
                  ? 'bg-[#8C6239] hover:bg-[#724F2C] text-[#F9F6EE] border border-[#6D4925]'
                  : 'bg-[#1A6EF0] hover:bg-[#1558C0] text-white'
              }`}
            >
              <span>{t.readyToStudyButton}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
