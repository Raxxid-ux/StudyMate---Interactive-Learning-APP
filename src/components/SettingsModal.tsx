/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Settings Modal
 * Provides configuration options for multi-theme selection (Meadow Sage benchmark, Aurora, Cosmic, Sepia, High Contrast),
 * ADHD & Dyslexia neurodiversity accessibility tools, study pace, audio,
 * and the dedicated "About the Creator" section with notes from Hamza Rashid.
 */

import React, { useState } from 'react';
import {
  X,
  Settings,
  Sun,
  Moon,
  Type,
  Sliders,
  Volume2,
  VolumeX,
  Quote,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  User,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  ExternalLink,
  MessageCircle,
  Activity,
  Eye,
  Zap,
  WitchHat,
  CheckCircle2,
  Info,
  HelpCircle,
} from './icons.tsx';
import { useThemeAndText, AppTheme, SupportStyle } from '../context/ThemeAndTextContext.tsx';
import type { StudyConfiguration } from '../types.ts';
import { playCalmChime, playSoftTap } from '../utils/audioChimes.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyConfig: StudyConfiguration;
  onUpdateStudyConfig: (newConfig: Partial<StudyConfiguration>) => void;
  onOpenAdmin?: () => void;
  onOpenFeedback?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  studyConfig,
  onUpdateStudyConfig,
  onOpenAdmin,
  onOpenFeedback,
}) => {
  const {
    theme,
    setTheme,
    textSize,
    setTextSize,
    dyslexicFont,
    toggleDyslexicFont,
    bionicReading,
    toggleBionicReading,
    readingRuler,
    toggleReadingRuler,
    singleChunkFocus,
    toggleSingleChunkFocus,
    supportStyle,
    setSupportStyle,
    memoHalloweenTheme,
    toggleMemoHalloweenTheme,
    language,
    setLanguage,
    uiDensity,
    setUiDensity,
    t,
  } = useThemeAndText();

  const [activeTab, setActiveTab] = useState<'appearance' | 'neurodiversity' | 'study' | 'creator'>('appearance');
  const [copiedNote, setCopiedNote] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymate_settings_tour_completed') === 'true';
    } catch {
      return false;
    }
  });
  const [expandedInfo, setExpandedInfo] = useState<Record<string, boolean>>({});

  const toggleInfo = (id: string) => {
    setExpandedInfo((prev) => ({ ...prev, [id]: !prev[id] }));
    playSoftTap(studyConfig.audioFeedback);
  };

  const handleDismissTour = () => {
    try {
      localStorage.setItem('studymate_settings_tour_completed', 'true');
    } catch {}
    setHasSeenTour(true);
    playSoftTap(studyConfig.audioFeedback);
  };

  const handleReopenTour = () => {
    try {
      localStorage.removeItem('studymate_settings_tour_completed');
    } catch {}
    setHasSeenTour(false);
    playSoftTap(studyConfig.audioFeedback);
  };

  if (!isOpen) return null;

  const notesFromMaker = `Never stop learning, even when the world makes you feel like you already know enough or that you're falling behind. You have something to contribute to the society and the time you're living in, even if you haven't figured out what it is yet. Stay curious, keep asking questions, and give yourself the patience to understand things deeply. You don't have to know everything today. Just keep growing into someone who can make a little more sense of the world, and perhaps leave it a little better than you found it.`;

  const handleCopyNote = async () => {
    try {
      await navigator.clipboard.writeText(notesFromMaker);
      setCopiedNote(true);
      playCalmChime(studyConfig.audioFeedback);
      setTimeout(() => setCopiedNote(false), 2500);
    } catch {
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2500);
    }
  };

  const handleResetDefaults = () => {
    playSoftTap(true);
    setTheme('meadow');
    setTextSize('normal');
    onUpdateStudyConfig({
      fontSize: 'standard',
      theme: 'daylight',
      plainWordsDefault: false,
      studyPace: 'calm',
      audioFeedback: true,
      questionTypeFilter: 'all',
      autoAdvanceChunks: false,
    });
  };

  const themesList: Array<{
    id: AppTheme;
    name: string;
    subtitle: string;
    previewBg: string;
    previewAccent: string;
    previewText: string;
  }> = [
    {
      id: 'meadow',
      name: 'Meadow Sage',
      subtitle: 'Calm sage green, soft airy contrast',
      previewBg: 'bg-[#F3F7F3]',
      previewAccent: 'bg-[#22C55E]',
      previewText: 'text-[#213327]',
    },
    {
      id: 'academia',
      name: 'Dark Academia',
      subtitle: 'Warm scholar parchment and deep antique tones',
      previewBg: 'bg-[#F7F4EC]',
      previewAccent: 'bg-[#C5A059]',
      previewText: 'text-[#2D251E]',
    },
    {
      id: 'cosmic',
      name: 'Cosmic Night',
      subtitle: 'Deep starlight slate for relaxed evening reading',
      previewBg: 'bg-[#10141D]',
      previewAccent: 'bg-[#60A5FA]',
      previewText: 'text-[#F1F5F9]',
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      subtitle: 'Maximum edge sharpness and bold tactile legibility',
      previewBg: 'bg-black',
      previewAccent: 'bg-[#A3E635]',
      previewText: 'text-white',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#161A22] rounded-3xl max-w-xl w-full border border-zinc-200/90 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A6EF0]/10 text-[#1A6EF0] flex items-center justify-center shadow-2xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-title" className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Settings & Accessibility
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Themes, ADHD & Dyslexia tools, study pacing, and creator notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (4 Sections) */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2.5 bg-zinc-100/60 dark:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800/60 overflow-x-auto tabs-container no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('appearance');
              playSoftTap(studyConfig.audioFeedback);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'appearance'
                ? 'bg-white dark:bg-[#1F2430] text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Themes</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('neurodiversity');
              playSoftTap(studyConfig.audioFeedback);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'neurodiversity'
                ? 'bg-white dark:bg-[#1F2430] text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>ADHD & Dyslexia</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('study');
              playSoftTap(studyConfig.audioFeedback);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'study'
                ? 'bg-white dark:bg-[#1F2430] text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Study Config</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('creator');
              playSoftTap(studyConfig.audioFeedback);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'creator'
                ? 'bg-white dark:bg-[#1F2430] text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* First-Visit Touring & Instructions Guide (dismissible and persistent) */}
          {!hasSeenTour && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-900/40 space-y-3 shadow-xs animate-fadeIn">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#1A6EF0] text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Welcome to StudyMate Settings
                    </h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      Scientific, research-backed controls designed to reduce cognitive load and support diverse learning styles.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDismissTour}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Dismiss guide"
                  aria-label="Dismiss first-visit guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/70 border border-blue-100/80 dark:border-blue-900/30 space-y-0.5">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Themes & Density</span>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug block">
                    Choose high-contrast or calm palettes, and select minimal spacing to avoid visual fatigue.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/70 border border-blue-100/80 dark:border-blue-900/30 space-y-0.5">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">ADHD & Dyslexia</span>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug block">
                    Lexend font prevents character crowding; bionic reading anchors fixation; ruler guides line tracking.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/70 border border-blue-100/80 dark:border-blue-900/30 space-y-0.5">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Study Pacing</span>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug block">
                    Configure one-chunk-at-a-time focus, simple wording, audio chimes, and smooth auto-advance.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Detailed guides will be tucked away after this tour so your UI stays uncluttered.
                </span>
                <button
                  type="button"
                  onClick={handleDismissTour}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1A6EF0] hover:bg-[#1558C4] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Got it, hide guide
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: APPEARANCE & THEMES */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Multi-Theme Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Color Themes
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {themesList.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        playSoftTap(studyConfig.audioFeedback);
                      }}
                      className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                        theme === t.id
                          ? 'border-[#1A6EF0] dark:border-[#64B5F6] bg-blue-50/40 dark:bg-blue-950/20 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-800/40'
                      }`}
                    >
                      {/* Theme Visual Palette Dot / Swatch */}
                      <div
                        className={`w-9 h-9 rounded-xl ${t.previewBg} border border-zinc-300/80 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${t.previewAccent}`} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {t.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                          {t.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* UI View Mode & Density: Minimal UI, Compact, Classic */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      UI Layout & Density
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Reduces visual clutter to avoid stress and decision fatigue
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setUiDensity('minimal');
                      playSoftTap(studyConfig.audioFeedback);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      uiDensity === 'minimal'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Minimal
                      </span>
                      {uiDensity === 'minimal' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Hides secondary banners for quiet reading
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUiDensity('compact');
                      playSoftTap(studyConfig.audioFeedback);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      uiDensity === 'compact'
                        ? 'border-[#1A6EF0] bg-blue-50/60 dark:bg-blue-950/30 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Compact
                      </span>
                      {uiDensity === 'compact' && <CheckCircle2 className="w-4 h-4 text-[#1A6EF0]" />}
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Tighter padding for dense document review
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUiDensity('classic');
                      playSoftTap(studyConfig.audioFeedback);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      uiDensity === 'classic'
                        ? 'border-[#1A6EF0] bg-blue-50/60 dark:bg-blue-950/30 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Comfortable
                      </span>
                      {uiDensity === 'classic' && <CheckCircle2 className="w-4 h-4 text-[#1A6EF0]" />}
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Spacious view with progress gauges
                    </p>
                  </button>
                </div>
              </div>

              {/* Language Selection: English & Simple Malayalam */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Language / ഭാഷ
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Clear English, or simple Malayalam for learners
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      playSoftTap(studyConfig.audioFeedback);
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      language === 'en'
                        ? 'border-[#1A6EF0] bg-blue-50/50 dark:bg-blue-950/30'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        English
                      </div>
                      <div className="text-[10px] text-zinc-500">Standard clear English</div>
                    </div>
                    {language === 'en' && <CheckCircle2 className="w-4 h-4 text-[#1A6EF0]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('ml');
                      playSoftTap(studyConfig.audioFeedback);
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      language === 'ml'
                        ? 'border-[#1A6EF0] bg-blue-50/50 dark:bg-blue-950/30'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        മലയാളം (Malayalam)
                      </div>
                      <div className="text-[10px] text-zinc-500">ലളിതമായ ഭാഷ</div>
                    </div>
                    {language === 'ml' && <CheckCircle2 className="w-4 h-4 text-[#1A6EF0]" />}
                  </button>
                </div>
              </div>

              {/* Memo Halloween Special Theme Toggle */}
              <div className="p-3.5 rounded-2xl bg-orange-50/40 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 flex items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-2">
                    <WitchHat className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Halloween costume for Memo
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleInfo('halloween')}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                      title="More details"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(!hasSeenTour || expandedInfo['halloween']) && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed animate-fadeIn">
                      Equips 3D Memo with a velvet witch hat and subtle pumpkin-violet lighting.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleMemoHalloweenTheme();
                    playCalmChime(studyConfig.audioFeedback);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    memoHalloweenTheme ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Toggle Memo Halloween theme"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      memoHalloweenTheme ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Typography / Reading Text Size */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Reading Text Size
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: 'normal', configVal: 'standard', label: 'Standard', scale: '1.0x' },
                    { id: 'large', configVal: 'large', label: 'Large', scale: '1.2x' },
                    { id: 'xlarge', configVal: 'xlarge', label: 'Extra Large', scale: '1.4x' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => {
                        setTextSize(sz.id as any);
                        onUpdateStudyConfig({ fontSize: sz.configVal as any });
                        playSoftTap(studyConfig.audioFeedback);
                      }}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        textSize === sz.id
                          ? 'border-[#1A6EF0] bg-[#1A6EF0]/5 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/40'
                      }`}
                    >
                      <div className="text-xs font-semibold">{sz.label}</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{sz.scale}</div>
                    </button>
                  ))}
                </div>

                {/* Typography Preview */}
                <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Live Typography Preview
                  </div>
                  <p
                    className={
                      textSize === 'xlarge'
                        ? 'text-lg font-medium text-zinc-900 dark:text-zinc-100'
                        : textSize === 'large'
                        ? 'text-base font-medium text-zinc-900 dark:text-zinc-100'
                        : 'text-sm font-medium text-zinc-900 dark:text-zinc-100'
                    }
                  >
                    StudyMate makes understanding your documents calm, bite-sized, and deeply rewarding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADHD & DYSLEXIA SUITE */}
          {activeTab === 'neurodiversity' && (
            <div className="space-y-4">
              {!hasSeenTour && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <span className="font-bold">Neurodiversity-Informed Design:</span> Tools built for scattered focus, visual crowding, ADHD attention drift, and dyslexia comprehension.
                  </div>
                </div>
              )}

              {/* 1. Dyslexia Font Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Dyslexia-friendly font (Lexend)
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleInfo('lexend')}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                      title="More details"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(!hasSeenTour || expandedInfo['lexend']) && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed animate-fadeIn">
                      Wider character spacing and bottom-weighted glyphs prevent letter flipping and crowding.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleDyslexicFont();
                    playSoftTap(studyConfig.audioFeedback);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    dyslexicFont ? 'bg-[#1A6EF0]' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Toggle dyslexia-friendly font"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      dyslexicFont ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 2. Bionic Reading Anchors */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Bionic reading anchors
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleInfo('bionic')}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                      title="More details"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(!hasSeenTour || expandedInfo['bionic']) && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed animate-fadeIn">
                      Bolds the initial letters of each word to create natural fixation anchors for faster scanning.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleBionicReading();
                    playSoftTap(studyConfig.audioFeedback);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    bionicReading ? 'bg-[#1A6EF0]' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Toggle bionic reading anchors"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      bionicReading ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 3. Horizontal Reading Ruler Guide */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Reading ruler cursor guide
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleInfo('ruler')}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                      title="More details"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(!hasSeenTour || expandedInfo['ruler']) && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed animate-fadeIn">
                      Projects a soft highlighting guide following your cursor to prevent skipping lines.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleReadingRuler();
                    playSoftTap(studyConfig.audioFeedback);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    readingRuler ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Toggle reading ruler overlay"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      readingRuler ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 4. ADHD Single-Chunk Focus (Low-Stimulus Mode) */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Single-chunk focus mode
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleInfo('singleChunk')}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                      title="More details"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(!hasSeenTour || expandedInfo['singleChunk']) && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed animate-fadeIn">
                      Gently dims peripheral content so only the active explanation is in full contrast.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleSingleChunkFocus();
                    playSoftTap(studyConfig.audioFeedback);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    singleChunkFocus ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Toggle single-chunk focus mode"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      singleChunkFocus ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 5. Support Style Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Companion Support Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'calm', label: 'Calm', desc: 'Grounding, serene pacing' },
                      { id: 'structured', label: 'Structured', desc: 'Predictable steps & order' },
                      { id: 'gentle', label: 'Gentle', desc: 'Warm, low-pressure support' },
                      { id: 'reflective', label: 'Reflective', desc: 'Inquiry and thoughtful pauses' },
                      { id: 'direct', label: 'Direct', desc: 'Punchy, concise takeaways' },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSupportStyle(s.id);
                        playSoftTap(studyConfig.audioFeedback);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        supportStyle === s.id
                          ? 'border-[#1A6EF0] bg-[#1A6EF0]/5 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Neurodiversity Reading Demo Box */}
              <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Accessibility Live Sample</span>
                  <span className="text-[10px] font-normal text-zinc-500">
                    {dyslexicFont ? 'Lexend Active' : 'Default Sans'} · {bionicReading ? 'Bionic Anchors On' : 'Standard'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {bionicReading ? (
                    <>
                      <span className="bionic-lead">Und</span>erstanding <span className="bionic-lead">co</span>mplex{' '}
                      <span className="bionic-lead">co</span>ncepts <span className="bionic-lead">be</span>comes{' '}
                      <span className="bionic-lead">si</span>mpler <span className="bionic-lead">wh</span>en{' '}
                      <span className="bionic-lead">ea</span>ch <span className="bionic-lead">se</span>ntence{' '}
                      <span className="bionic-lead">is</span> <span className="bionic-lead">an</span>chored{' '}
                      <span className="bionic-lead">cl</span>early.
                    </>
                  ) : (
                    'Understanding complex concepts becomes simpler when each sentence is anchored clearly and paced at your natural frequency.'
                  )}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: STUDY CONFIGURATION */}
          {activeTab === 'study' && (
            <div className="space-y-6">
              {/* Study Pace */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Study Pace
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'calm', label: 'Calm', desc: '1 chunk at a time' },
                    { id: 'balanced', label: 'Balanced', desc: 'Standard pacing' },
                    { id: 'fast', label: 'Overview', desc: 'All chunks at once' },
                  ].map((pace) => (
                    <button
                      key={pace.id}
                      type="button"
                      onClick={() => {
                        onUpdateStudyConfig({ studyPace: pace.id as any });
                        playSoftTap(studyConfig.audioFeedback);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        studyConfig.studyPace === pace.id
                          ? 'border-[#1A6EF0] bg-[#1A6EF0]/5 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{pace.label}</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{pace.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plain Words Default */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Plain language explanations
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleInfo('plainWords')}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                      title="More details"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(!hasSeenTour || expandedInfo['plainWords']) && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed animate-fadeIn">
                      Simplifies dense academic sentences into clear, direct language.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStudyConfig({ plainWordsDefault: !studyConfig.plainWordsDefault });
                    playSoftTap(studyConfig.audioFeedback);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    studyConfig.plainWordsDefault ? 'bg-[#1A6EF0]' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Toggle plain language explanations"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      studyConfig.plainWordsDefault ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Audio Feedback / Chimes */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Sound feedback on completion
                    </span>
                    <button
                      type="button"
                      onClick={() => playCalmChime(true)}
                      className="text-[10px] font-semibold text-[#1A6EF0] hover:underline cursor-pointer"
                    >
                      (Test Sound)
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleInfo('audio')}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                      title="More details"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(!hasSeenTour || expandedInfo['audio']) && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed animate-fadeIn">
                      Plays gentle audio tones when completing quizzes and lessons.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !studyConfig.audioFeedback;
                    onUpdateStudyConfig({ audioFeedback: next });
                    if (next) playCalmChime(true);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    studyConfig.audioFeedback ? 'bg-[#1A6EF0]' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Toggle sound feedback"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      studyConfig.audioFeedback ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Advance Chunks */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Auto-advance after quiz
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleInfo('autoAdvance')}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                      title="More details"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(!hasSeenTour || expandedInfo['autoAdvance']) && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed animate-fadeIn">
                      Smoothly reveals the next chunk as soon as your check question is solved.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStudyConfig({ autoAdvanceChunks: !studyConfig.autoAdvanceChunks });
                    playSoftTap(studyConfig.audioFeedback);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    studyConfig.autoAdvanceChunks ? 'bg-[#1A6EF0]' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Toggle auto-advance"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      studyConfig.autoAdvanceChunks ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT THE CREATOR */}
          {activeTab === 'creator' && (
            <div className="space-y-5">
              {/* Creator Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/70 via-white to-sky-50/60 dark:from-[#211720] dark:via-[#1A1E27] dark:to-[#16202A] border border-rose-200/70 dark:border-rose-900/40 shadow-xs space-y-5">
                {/* Creator Header with Official App Icon & Profile */}
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src="/assets/aistudio/Glowing_Wings_and_Orbiting_Robot_bb9b728c.png"
                      alt="StudyMate Icon"
                      className="w-14 h-14 rounded-2xl object-contain shadow-md border border-rose-200/80 dark:border-rose-900/50 bg-white dark:bg-[#12151B] p-0.5"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#1A6EF0] dark:text-[#64B5F6] text-[10px] font-bold tracking-wider uppercase">
                      <Info className="w-3 h-3" />
                      <span>About</span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenAdmin) {
                            onClose();
                            onOpenAdmin();
                          }
                        }}
                        className="text-left font-bold text-zinc-900 dark:text-white hover:text-[#1A6EF0] dark:hover:text-[#64B5F6] transition-colors cursor-pointer select-none focus:outline-none"
                        title="Hamza Rashid K"
                      >
                        Hamza Rashid K
                      </button>
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Creator of StudyMate & Memo Companion
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-rose-100 dark:bg-rose-950/60" />

                {/* Notes from the maker */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                      <Quote className="w-3.5 h-3.5" />
                      <span>Notes from the maker</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyNote}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title="Copy inspiration note"
                    >
                      {copiedNote ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy note</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Exact Quote Block */}
                  <blockquote className="p-4 rounded-2xl bg-white/90 dark:bg-[#12151B]/80 border border-zinc-200/80 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal italic relative shadow-2xs">
                    "{notesFromMaker}"
                  </blockquote>
                </div>

                {/* Contact Information Cards */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                      <User className="w-3.5 h-3.5" />
                      <span>Contact</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenAdmin) {
                          onClose();
                          onOpenAdmin();
                        }
                      }}
                      className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-[#1A6EF0] dark:hover:text-[#64B5F6] transition-colors cursor-pointer select-none"
                    >
                      Hamza Rashid K
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Phone */}
                    <a
                      href="tel:+919656756757"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-[#12151B]/80 border border-zinc-200/80 dark:border-zinc-800 hover:border-[#1A6EF0]/40 dark:hover:border-[#1A6EF0]/50 hover:bg-[#1A6EF0]/5 dark:hover:bg-[#1A6EF0]/10 transition-all shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#1A6EF0] dark:text-[#64B5F6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          Phone
                        </div>
                        <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                          +91 9656756757
                        </div>
                      </div>
                    </a>

                    {/* Mail */}
                    <a
                      href="mailto:hamzarashid3214@gmail.com"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-[#12151B]/80 border border-zinc-200/80 dark:border-zinc-800 hover:border-rose-400/50 dark:hover:border-rose-500/50 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-all shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          Mail
                        </div>
                        <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                          hamzarashid3214@gmail.com
                        </div>
                      </div>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com/raxxid.666"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-[#12151B]/80 border border-zinc-200/80 dark:border-zinc-800 hover:border-pink-400/50 dark:hover:border-pink-500/50 hover:bg-pink-50/40 dark:hover:bg-pink-950/20 transition-all shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          Instagram
                        </div>
                        <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                          @raxxid.666
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/in/hamza-rashid-k-1ab76b22a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-[#12151B]/80 border border-zinc-200/80 dark:border-zinc-800 hover:border-sky-400/50 dark:hover:border-sky-500/50 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-all shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-[#0A66C2] dark:text-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Linkedin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          LinkedIn
                        </div>
                        <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                          Hamza Rashid K
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Mission Badge */}
                <div className="p-3.5 rounded-2xl bg-[#1A6EF0]/5 dark:bg-[#1A6EF0]/10 border border-[#1A6EF0]/15 flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#1A6EF0] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    StudyMate was built with the belief that anyone can grasp complex knowledge when given calm pacing, honest grounding, and a friendly companion like Memo.
                  </p>
                </div>

                {/* Feedback & Improvement Shortcut */}
                {onOpenFeedback && (
                  <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Have suggestions for improvement?</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                        Share feedback directly with the team to make StudyMate better
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenFeedback();
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      Give Feedback
                    </button>
                  </div>
                )}

                {/* Admin Portal is tucked discretely behind creator name "Hamza Rashid K" */}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to defaults</span>
            </button>

            {hasSeenTour && (
              <button
                type="button"
                onClick={handleReopenTour}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-[#1A6EF0] dark:hover:text-[#64B5F6] hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Show guide</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              playSoftTap(studyConfig.audioFeedback);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#1A6EF0] hover:bg-[#1558C4] text-white shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
