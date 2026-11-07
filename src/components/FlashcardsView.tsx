/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Layers, RotateCcw, CheckCircle, ChevronLeft, ChevronRight, AlertCircle } from './icons.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { CourseData, GlossaryItem } from '../types.ts';

interface FlashcardsViewProps {
  course: CourseData;
}

interface EnrichedFlashcard extends GlossaryItem {
  id: string;
  sectionTitle: string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ course }) => {
  const { fontSizeClass, theme } = useThemeAndText();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'learning' | 'mastered'>('all');

  const allCards = useMemo(() => {
    const list: EnrichedFlashcard[] = [];
    course.sections.forEach((sec) => {
      if (sec.lesson?.glossary) {
        sec.lesson.glossary.forEach((g, gIdx) => {
          list.push({
            ...g,
            id: `${sec.sectionIndex}-${gIdx}-${g.term}`,
            sectionTitle: sec.title,
          });
        });
      }
    });
    return list;
  }, [course]);

  const filteredCards = useMemo(() => {
    if (filter === 'mastered') {
      return allCards.filter((c) => masteredIds.has(c.id));
    }
    if (filter === 'learning') {
      return allCards.filter((c) => !masteredIds.has(c.id));
    }
    return allCards;
  }, [allCards, filter, masteredIds]);

  const currentCard = filteredCards[currentIndex] || null;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1 < filteredCards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredCards.length - 1));
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (allCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#1A6EF0]/10 text-[#1A6EF0] flex items-center justify-center">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-light text-zinc-900 dark:text-zinc-100">
          Terms are being compiled
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
          Interactive study cards appear here as lessons define key terms from your document.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-36 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-light text-zinc-900 dark:text-zinc-100 tracking-tight">
              Study Cards
            </h1>
            <span className="border border-zinc-400/40 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded text-zinc-500">
              STUDY DRAFT
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Definitions extracted strictly from your document.
          </p>
        </div>

        {/* Filters */}
        <div
          className={`flex items-center gap-1 p-1 rounded-2xl border ${
            theme === 'academia'
              ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E4D8C8] dark:border-[#382E25]'
              : 'bg-zinc-100/90 dark:bg-zinc-800/80 border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <button
            onClick={() => {
              setFilter('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            All ({allCards.length})
          </button>
          <button
            onClick={() => {
              setFilter('learning');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'learning'
                ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Learning ({allCards.length - masteredIds.size})
          </button>
          <button
            onClick={() => {
              setFilter('mastered');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'mastered'
                ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Mastered ({masteredIds.size})
          </button>
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 dark:text-zinc-400">
          No cards in this filter.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <span className="text-zinc-400 text-[11px]">
              Tap card to flip
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full min-h-[300px] sm:min-h-[340px] rounded-3xl p-8 sm:p-10 border-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#1A6EF0] transition-all cursor-pointer flex flex-col justify-between select-none relative group ${
              theme === 'academia'
                ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#E4D8C8] dark:border-[#382E25]'
                : 'bg-white dark:bg-zinc-850 border-zinc-200/80 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {isFlipped ? 'Document Explanation' : 'Defined Term'}
              </span>
              <span className="truncate max-w-xs">{currentCard.sectionTitle}</span>
            </div>

            <div className="my-auto py-6 text-center space-y-4">
              {!isFlipped ? (
                <div className="space-y-2">
                  <h3 className="text-3xl font-light text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {currentCard.term}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Tap to see what the document says
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-w-lg mx-auto">
                  <p className={`text-zinc-800 dark:text-zinc-200 ${fontSizeClass} font-normal leading-relaxed`}>
                    {currentCard.definition}
                  </p>
                  {currentCard.definition.includes('Mentioned in the text, but not defined') && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      <AlertCircle className="w-3 h-3" /> Undefined in source
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-[#1A6EF0]" /> Tap to flip
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMastered(currentCard.id);
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                  masteredIds.has(currentCard.id)
                    ? 'bg-[#A8C7FA] text-[#0A387E]'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{masteredIds.has(currentCard.id) ? 'Mastered' : 'Mark as Mastered'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="h-11 px-4 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span className="leading-none">Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A6EF0] text-white text-xs sm:text-sm font-semibold hover:bg-[#1558C4] transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span className="leading-none">Next Card</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
