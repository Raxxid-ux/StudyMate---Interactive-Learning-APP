/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Settings Modal
 * Provides configuration options for theme, typography, study pace, audio,
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
  Heart,
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
} from './icons.tsx';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import type { StudyConfiguration } from '../types.ts';
import { playCalmChime, playSoftTap } from '../utils/audioChimes.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyConfig: StudyConfiguration;
  onUpdateStudyConfig: (newConfig: Partial<StudyConfiguration>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  studyConfig,
  onUpdateStudyConfig,
}) => {
  const { theme, setTheme, textSize, setTextSize } = useThemeAndText();
  const [activeTab, setActiveTab] = useState<'appearance' | 'study' | 'creator'>('appearance');
  const [copiedNote, setCopiedNote] = useState(false);

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
    setTheme('light');
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
              <h2 id="settings-title" className="text-base sm:text-lg font-semibold text-[#3A3F4F] dark:text-[#F1F3F7] tracking-tight">
                Settings
              </h2>
              <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                Personalize your StudyMate study experience
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-zinc-100/60 dark:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <button
            onClick={() => {
              setActiveTab('appearance');
              playSoftTap(studyConfig.audioFeedback);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-white dark:bg-[#1F2430] text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('study');
              playSoftTap(studyConfig.audioFeedback);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'creator'
                ? 'bg-white dark:bg-[#1F2430] text-[#E11D48] dark:text-[#FB7185] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-[#E11D48] dark:hover:text-[#FB7185]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-[#E11D48]" />
            <span>About Creator</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Mode */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Theme Mode
                  </label>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    Light is default
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('light');
                      onUpdateStudyConfig({ theme: 'daylight' });
                      playSoftTap(studyConfig.audioFeedback);
                    }}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                      theme === 'light'
                        ? 'border-[#1A6EF0] bg-[#1A6EF0]/5 dark:bg-[#1A6EF0]/10 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#3A3F4F] dark:text-[#F1F3F7]">
                        Light Theme
                      </div>
                      <div className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9]">
                        Default, paper-clear
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTheme('dark');
                      onUpdateStudyConfig({ theme: 'twilight' });
                      playSoftTap(studyConfig.audioFeedback);
                    }}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                      theme === 'dark'
                        ? 'border-[#1A6EF0] bg-[#1A6EF0]/5 dark:bg-[#1A6EF0]/10 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#3A3F4F] dark:text-[#F1F3F7]">
                        Dark Theme
                      </div>
                      <div className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9]">
                        Relaxed evening reading
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Typography / Text Size */}
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
                    Live Preview
                  </div>
                  <p
                    className={
                      textSize === 'xlarge'
                        ? 'text-lg font-medium text-[#3A3F4F] dark:text-[#F1F3F7]'
                        : textSize === 'large'
                        ? 'text-base font-medium text-[#3A3F4F] dark:text-[#F1F3F7]'
                        : 'text-sm font-medium text-[#3A3F4F] dark:text-[#F1F3F7]'
                    }
                  >
                    StudyMate makes understanding your documents calm, bite-sized, and deeply rewarding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDY CONFIGURATION */}
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
                  <div className="text-sm font-semibold text-[#3A3F4F] dark:text-[#F1F3F7]">
                    Simpler Words by Default
                  </div>
                  <div className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                    Automatically simplify dense academic or technical sentences
                  </div>
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
                  aria-label="Toggle simpler words by default"
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
                    <span className="text-sm font-semibold text-[#3A3F4F] dark:text-[#F1F3F7]">
                      Calm Audio Chimes
                    </span>
                    <button
                      type="button"
                      onClick={() => playCalmChime(true)}
                      className="text-[10px] font-semibold text-[#1A6EF0] hover:underline cursor-pointer"
                    >
                      (Test Sound)
                    </button>
                  </div>
                  <div className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                    Play soothing web audio tones when completing quizzes and sections
                  </div>
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
                  aria-label="Toggle calm audio chimes"
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
                  <div className="text-sm font-semibold text-[#3A3F4F] dark:text-[#F1F3F7]">
                    Auto-Advance on Correct Answer
                  </div>
                  <div className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                    Smoothly reveal the next chunk as soon as your check question is solved
                  </div>
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
                  aria-label="Toggle auto advance chunks"
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

          {/* TAB 3: ABOUT THE CREATOR */}
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
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold tracking-wider uppercase">
                      <Heart className="w-3 h-3 fill-current text-rose-500" />
                      <span>About the Creator</span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                      <span>Hamza Rashid K</span>
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
                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Hamza Rashid K</span>
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
                  <p className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9] leading-relaxed">
                    StudyMate was built with the belief that anyone can grasp complex knowledge when given calm pacing, honest grounding, and a friendly companion like Memo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to defaults</span>
          </button>

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
