/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Memo Chatbot Component
 * Embodied as a cute white minimal pen with green-to-blue futuristic lighting headgear.
 * Used to ask doubts and configure study settings.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sliders,
  Box,
  X,
  Send,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Quote,
  Lightbulb,
  RotateCcw,
  BookOpen,
  WitchHat,
  VampireFangs,
} from './icons.tsx';
import { MemoThreeCanvas, MemoMood, MemoColorPreset } from './MemoThreeCanvas';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import { Section, CourseData, StudyConfiguration, MemoChatMessage } from '../types';
import { playCalmChime, playSoftTap, playMemoGreeting } from '../utils/audioChimes';

interface MemoChatbotProps {
  currentSection?: Section | null;
  fullDocumentText?: string;
  courseData?: CourseData | null;
  studyConfig: StudyConfiguration;
  onUpdateStudyConfig: (newConfig: Partial<StudyConfiguration>) => void;
  onNavigateToSection?: (sectionIndex: number) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  onOpenFullSettings?: () => void;
}

export const MemoChatbot: React.FC<MemoChatbotProps> = ({
  currentSection,
  fullDocumentText = '',
  courseData,
  studyConfig,
  onUpdateStudyConfig,
  onNavigateToSection,
  isOpen: propIsOpen,
  onToggleOpen,
  onOpenFullSettings,
}) => {
  const { memoHalloweenTheme, toggleMemoHalloweenTheme } = useThemeAndText();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

  const [activeTab, setActiveTab] = useState<'doubts' | 'config' | 'playground'>('doubts');
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [memoMood, setMemoMood] = useState<MemoMood>('idle');
  const [colorPreset, setColorPreset] = useState<MemoColorPreset>(
    memoHalloweenTheme ? 'halloween' : 'aurora'
  );

  // Messages list with a friendly initial message
  const [messages, setMessages] = useState<MemoChatMessage[]>([
    {
      id: 'init-1',
      sender: 'memo',
      text: "Hi, I'm Memo! I'm your calm study companion. You can ask me any doubt about your document or tell me how you want to configure your study settings.",
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Explain this section in simpler words',
        'What are the key points to remember?',
        'How can I configure my study settings?',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isGenerating]);

  // Quick suggestions based on context
  const getContextualPrompts = () => {
    if (currentSection?.lesson) {
      return [
        `Explain "${currentSection.title}" in simpler words`,
        'What is the most important concept in this section?',
        'Give me a clear real example from this text',
        'Help me configure my text size and theme',
      ];
    }
    return [
      'What is this whole course about?',
      'Help me set up a calm study pace',
      'Explain how my study progress is saved',
      'Make my study text larger',
    ];
  };

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isGenerating) return;

    playSoftTap(studyConfig.audioFeedback);
    const userMsg: MemoChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsGenerating(true);
    setMemoMood('thinking');

    try {
      const response = await fetch('/api/memo-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          currentSectionTitle: currentSection?.title || '',
          currentSectionContent: currentSection?.content || '',
          fullDocumentText: fullDocumentText,
          currentConfigs: studyConfig,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const memoMsg: MemoChatMessage = {
        id: `m-${Date.now()}`,
        sender: 'memo',
        text: data.answer || "I'm right here with you. Let's take it one step at a time.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceQuote: data.sourceQuote || undefined,
        suggestedAction: data.suggestedConfigChange || undefined,
        suggestedFollowUps: data.suggestedFollowUps || [],
      };

      setMessages((prev) => [...prev, memoMsg]);
      setMemoMood('happy');
      playCalmChime(studyConfig.audioFeedback);

      // Auto-apply suggested configuration change if detected
      if (data.suggestedConfigChange && data.suggestedConfigChange.key) {
        const { key, value } = data.suggestedConfigChange;
        const configUpdates: Partial<StudyConfiguration> = {};

        if (key === 'fontSize') {
          if (value === 'standard' || value === 'large' || value === 'xlarge') {
            configUpdates.fontSize = value;
          } else if (typeof value === 'string' && (value.includes('xlarge') || value.includes('extra'))) {
            configUpdates.fontSize = 'xlarge';
          } else if (typeof value === 'string' && (value.includes('big') || value.includes('large'))) {
            configUpdates.fontSize = 'large';
          } else {
            configUpdates.fontSize = 'standard';
          }
        } else if (key === 'theme') {
          if (value === 'daylight' || value === 'slate' || value === 'twilight') {
            configUpdates.theme = value;
          } else if (typeof value === 'string' && (value.includes('dark') || value.includes('night') || value.includes('twilight'))) {
            configUpdates.theme = 'twilight';
          } else {
            configUpdates.theme = 'daylight';
          }
        } else if (key === 'plainWords' || key === 'plainWordsDefault') {
          configUpdates.plainWordsDefault = Boolean(value);
        } else if (key === 'pace' || key === 'studyPace') {
          if (value === 'calm' || value === 'balanced' || value === 'fast') {
            configUpdates.studyPace = value;
          } else if (typeof value === 'string' && (value.includes('quick') || value.includes('fast') || value.includes('all'))) {
            configUpdates.studyPace = 'fast';
          } else {
            configUpdates.studyPace = 'calm';
          }
        } else if (key === 'soundEnabled' || key === 'audioFeedback') {
          configUpdates.audioFeedback = Boolean(value);
        } else if (key === 'autoAdvance' || key === 'autoAdvanceChunks') {
          configUpdates.autoAdvanceChunks = Boolean(value);
        }

        if (Object.keys(configUpdates).length > 0) {
          onUpdateStudyConfig(configUpdates);
        }
      }

      setTimeout(() => {
        setMemoMood('idle');
      }, 3500);
    } catch (err: any) {
      console.error('Memo ask error:', err);
      setMemoMood('idle');
      const errorMsg: MemoChatMessage = {
        id: `m-err-${Date.now()}`,
        sender: 'memo',
        text: "I couldn't reach the server right now. Let's take a calm breath and try again in a moment.",
        timestamp: 'Just now',
        suggestedFollowUps: ['Try again', 'Show key points'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleOpen = () => {
    if (!isOpen) {
      playMemoGreeting(studyConfig.audioFeedback);
    } else {
      playSoftTap(studyConfig.audioFeedback);
    }
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  return (
    <>
      {/* FLOATING DOCKED COMPANION BUTTON (WHEN CLOSED) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center group">
          {/* Tooltip pill - appears smoothly on hover, zero interference when not hovered */}
          <button
            type="button"
            onClick={toggleOpen}
            className="mr-2.5 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-[#3A3F4F] dark:text-slate-200 text-xs font-medium shadow-md border border-slate-200/80 dark:border-slate-800 backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto translate-x-2 group-hover:translate-x-0 cursor-pointer hover:border-[#2BA8F0]"
          >
            <span className="w-2 h-2 rounded-full bg-[#22D08B] animate-ping" />
            <span>Ask Memo · Doubts & Settings</span>
          </button>

          <button
            type="button"
            onClick={toggleOpen}
            aria-label="Open Memo chat"
            className="relative w-14 h-14 rounded-full bg-white dark:bg-slate-900 shadow-xl border-2 border-slate-200/80 dark:border-slate-700/80 hover:border-[#2BA8F0] dark:hover:border-[#22D08B] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#2BA8F0]/20 overflow-hidden cursor-pointer"
            title="Chat with Memo"
          >
            {/* Glowing gradient aura backdrop */}
            <div
              className={`absolute inset-0 transition-colors ${
                memoHalloweenTheme
                  ? 'bg-gradient-to-tr from-[#FF6B00]/25 via-[#9D4EDD]/25 to-[#FF7700]/20 animate-pulse'
                  : 'bg-gradient-to-tr from-[#2BA8F0]/15 via-[#22D08B]/20 to-[#7FDB22]/20 animate-pulse'
              }`}
            />

            {/* Live miniature 3D Memo in the button */}
            <div className="w-12 h-12 pointer-events-none">
              <MemoThreeCanvas
                size="compact"
                mood={memoMood}
                interactive={false}
                soundEnabled={false}
                customColorPreset={memoHalloweenTheme ? 'halloween' : colorPreset}
                halloweenTheme={memoHalloweenTheme}
              />
            </div>
          </button>
        </div>
      )}

      {/* EXPANDED CHAT / CONFIGURATION MODAL / DRAWER */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col bg-white dark:bg-[#1e2330] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-10'
              : 'bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 w-[calc(100vw-24px)] sm:w-[440px] md:w-[460px] max-w-[460px] h-[640px] max-h-[90vh]'
          }`}
        >
          {/* TOP BAR / CHARACTER HEADER */}
          <div className="relative px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-[#F0FDF4] dark:from-[#181d28] dark:via-[#1e2330] dark:to-[#16251f] flex items-center justify-between gap-2 shrink-0">
            {/* Memo Avatar & Title */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div
                onClick={() => {
                  setMemoMood('happy');
                  playCalmChime(studyConfig.audioFeedback);
                  setTimeout(() => setMemoMood('idle'), 2500);
                }}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border overflow-hidden cursor-pointer transition-all flex items-center justify-center relative shrink-0 ${
                  memoHalloweenTheme
                    ? 'border-orange-400 dark:border-orange-500 hover:ring-2 hover:ring-orange-400/40'
                    : 'border-slate-200 dark:border-slate-700/60 hover:ring-2 hover:ring-[#22D08B]/40'
                }`}
                title="Tap Memo to emote!"
              >
                <div className="w-12 h-12">
                  <MemoThreeCanvas
                    size="compact"
                    mood={memoMood}
                    interactive={false}
                    soundEnabled={studyConfig.audioFeedback}
                    customColorPreset={memoHalloweenTheme ? 'halloween' : colorPreset}
                    halloweenTheme={memoHalloweenTheme}
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm sm:text-base text-[#3A3F4F] dark:text-slate-100 leading-tight">
                    Memo
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-[#22D08B] animate-pulse shrink-0" />
                </div>
                <p className="text-xs text-[#5F6573] dark:text-slate-400 truncate">
                  {currentSection
                    ? currentSection.title
                    : 'Ready to clear doubts & help you configure'}
                </p>
              </div>
            </div>

            {/* Action buttons on the right - cleanly aligned, cannot overflow */}
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateStudyConfig({ audioFeedback: !studyConfig.audioFeedback })
                }
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title={studyConfig.audioFeedback ? 'Mute chimes' : 'Enable chimes'}
                aria-label="Toggle chimes"
              >
                {studyConfig.audioFeedback ? (
                  <Volume2 className="w-4 h-4 text-[#22D08B]" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex cursor-pointer shrink-0"
                title={isExpanded ? 'Restore window size' : 'Expand window'}
                aria-label="Expand or restore window"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* Close button - high contrast, prominent, never pushed off screen */}
              <button
                type="button"
                onClick={toggleOpen}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-200 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shrink-0 shadow-2xs"
                title="Close Memo"
                aria-label="Close Memo"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* TAB SELECTOR */}
          <div className="px-3 sm:px-4 pt-2 pb-2 bg-white dark:bg-[#1e2330] border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0">
            <button
              onClick={() => {
                setActiveTab('doubts');
                playSoftTap(studyConfig.audioFeedback);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === 'doubts'
                  ? 'bg-[#1A6EF0] text-white shadow-sm'
                  : 'text-[#5F6573] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Doubts</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('config');
                playSoftTap(studyConfig.audioFeedback);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-[#1A6EF0] text-white shadow-sm'
                  : 'text-[#5F6573] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configurations</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('playground');
                playSoftTap(studyConfig.audioFeedback);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === 'playground'
                  ? 'bg-[#1A6EF0] text-white shadow-sm'
                  : 'text-[#5F6573] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Box className="w-3.5 h-3.5 shrink-0" />
              <span>Memo Customize</span>
              {memoHalloweenTheme && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* TAB CONTENT 1: ASK DOUBTS */}
          {activeTab === 'doubts' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#F9FAFC] dark:bg-[#171b24]">
              {/* Messages scroll area */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#1A6EF0] text-white rounded-br-sm'
                          : 'bg-white dark:bg-[#222836] text-[#3A3F4F] dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/60 rounded-bl-sm'
                      }`}
                    >
                      {/* Message text */}
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Source quote badge */}
                      {msg.sourceQuote && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                          <Quote className="w-3.5 h-3.5 text-[#2BA8F0] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                              From your document:
                            </span>
                            <span className="italic font-normal">"{msg.sourceQuote}"</span>
                          </div>
                        </div>
                      )}

                      {/* Suggested action pill */}
                      {msg.suggestedAction && (
                        <div className="mt-2.5 flex items-center gap-2 p-2 bg-[#F0FDF4] dark:bg-[#16251f] rounded-xl border border-[#B5F55A]/50 text-xs text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22D08B] shrink-0" />
                          <span>{msg.suggestedAction.description}</span>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>

                    {/* Suggested follow-up buttons */}
                    {msg.sender === 'memo' &&
                      msg.suggestedFollowUps &&
                      msg.suggestedFollowUps.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                          {msg.suggestedFollowUps.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(prompt)}
                              className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#5F6573] dark:text-slate-300 hover:border-[#1A6EF0] hover:text-[#1A6EF0] dark:hover:border-[#22D08B] dark:hover:text-[#22D08B] transition-colors text-left"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {/* Thinking animation state */}
                {isGenerating && (
                  <div className="flex items-start gap-2">
                    <div className="bg-white dark:bg-[#222836] border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#2BA8F0] animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-[#22D08B] animate-bounce"
                        style={{ animationDelay: '0.15s' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-[#7FDB22] animate-bounce"
                        style={{ animationDelay: '0.3s' }}
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                        Memo is checking your document...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick contextual chips */}
              <div className="px-5 pt-2 pb-1 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-[#1b202c]/70">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {getContextualPrompts().map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p)}
                    className="whitespace-nowrap text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#5F6573] dark:text-slate-300 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <div className="p-3 bg-white dark:bg-[#1e2330] border-t border-slate-100 dark:border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/70 rounded-2xl px-3.5 py-2 border border-slate-200/70 dark:border-slate-700/60 focus-within:ring-2 focus-within:ring-[#1A6EF0]/20 focus-within:border-[#1A6EF0]"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask Memo any doubt about your document..."
                    className="flex-1 bg-transparent text-sm text-[#3A3F4F] dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                    disabled={isGenerating}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isGenerating}
                    className="w-8 h-8 rounded-xl bg-[#1A6EF0] hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-[#1A6EF0] text-white flex items-center justify-center transition-all shrink-0"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: STUDY CONFIGURATIONS */}
          {activeTab === 'config' && (
            <div className="flex-1 overflow-y-auto p-6 bg-[#F9FAFC] dark:bg-[#171b24] space-y-6">
              <div>
                <h4 className="font-semibold text-sm text-[#3A3F4F] dark:text-slate-200 mb-1">
                  Calm Learning Configurations
                </h4>
                <p className="text-xs text-[#5F6573] dark:text-slate-400">
                  Configure how you digest lessons to minimize overload and fatigue.
                </p>
              </div>

              {/* 1. Text Size */}
              <div className="bg-white dark:bg-[#202534] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Lesson Text Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'large', 'xlarge'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => onUpdateStudyConfig({ fontSize: size })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        studyConfig.fontSize === size
                          ? 'border-[#1A6EF0] bg-blue-50/70 dark:bg-blue-900/30 text-[#1A6EF0] dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-[#5F6573] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {size === 'standard' && 'Standard (16px)'}
                      {size === 'large' && 'Large (18px)'}
                      {size === 'xlarge' && 'Extra Large (20px)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Theme Mood */}
              <div className="bg-white dark:bg-[#202534] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Visual Theme & Contrast
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'daylight', label: 'Daylight', desc: 'Cool soft gray' },
                    { id: 'slate', label: 'Slate Dark', desc: 'Cozy dark slate' },
                    { id: 'twilight', label: 'Twilight', desc: 'Gentle night' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      onClick={() => onUpdateStudyConfig({ theme: thm.id as any })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        studyConfig.theme === thm.id
                          ? 'border-[#1A6EF0] bg-blue-50/70 dark:bg-blue-900/30 text-[#1A6EF0] dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-[#5F6573] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>{thm.label}</div>
                      <div className="text-[10px] text-slate-400">{thm.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Study Pace */}
              <div className="bg-white dark:bg-[#202534] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Study Pace
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'calm', label: 'Calm', desc: '1 chunk at a time' },
                    { id: 'balanced', label: 'Balanced', desc: 'Standard reveal' },
                    { id: 'fast', label: 'Full Read', desc: 'All chunks open' },
                  ].map((pace) => (
                    <button
                      key={pace.id}
                      onClick={() => onUpdateStudyConfig({ studyPace: pace.id as any })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        studyConfig.studyPace === pace.id
                          ? 'border-[#1A6EF0] bg-blue-50/70 dark:bg-blue-900/30 text-[#1A6EF0] dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-[#5F6573] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>{pace.label}</div>
                      <div className="text-[10px] text-slate-400">{pace.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Simpler Wording Default (Plain Words Mode) */}
              <div className="bg-white dark:bg-[#202534] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Default Simpler Wording
                  </div>
                  <div className="text-[11px] text-[#5F6573] dark:text-slate-400">
                    Always show plain words first for lower stress
                  </div>
                </div>
                <button
                  onClick={() =>
                    onUpdateStudyConfig({
                      plainWordsDefault: !studyConfig.plainWordsDefault,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    studyConfig.plainWordsDefault ? 'bg-[#1A6EF0]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform transform ${
                      studyConfig.plainWordsDefault ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 5. Sound Chimes */}
              <div className="bg-white dark:bg-[#202534] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Procedural Audio Chimes
                  </div>
                  <div className="text-[11px] text-[#5F6573] dark:text-slate-400">
                    Calm, soothing sound feedback on correct answers and progress
                  </div>
                </div>
                <button
                  onClick={() =>
                    onUpdateStudyConfig({
                      audioFeedback: !studyConfig.audioFeedback,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    studyConfig.audioFeedback ? 'bg-[#22D08B]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform transform ${
                      studyConfig.audioFeedback ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reset to calm default */}
              <button
                onClick={() => {
                  onUpdateStudyConfig({
                    fontSize: 'standard',
                    theme: 'daylight',
                    plainWordsDefault: false,
                    studyPace: 'calm',
                    audioFeedback: true,
                    questionTypeFilter: 'all',
                    autoAdvanceChunks: false,
                  });
                  playCalmChime(true);
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-[#1A6EF0] hover:text-[#1A6EF0] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Recommended Calm Settings</span>
              </button>

              {onOpenFullSettings && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenFullSettings();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#1A6EF0]" />
                  <span>Open Full Settings & About Creator</span>
                </button>
              )}
            </div>
          )}

          {/* TAB CONTENT 3: MEMO CUSTOMIZE & 3D */}
          {activeTab === 'playground' && (
            <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#F9FAFC] dark:bg-[#171b24] overflow-y-auto items-center space-y-3.5">
              <div className="text-center shrink-0">
                <h4 className="font-semibold text-sm text-[#3A3F4F] dark:text-slate-200">
                  Memo Customization & 3D Model
                </h4>
                <p className="text-xs text-[#5F6573] dark:text-slate-400 max-w-xs mx-auto">
                  Move your mouse or tap Memo to see physics tilt, spins, and custom outfit accessories.
                </p>
              </div>

              {/* 3D Canvas Showcase - Protected against flex shrink with explicit min-height */}
              <div className="w-full max-w-[280px] sm:max-w-xs h-64 shrink-0 min-h-[256px] relative bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200/50 dark:from-[#1b212f] dark:via-[#161a25] dark:to-[#12161f] rounded-3xl border border-slate-300 dark:border-slate-700/80 shadow-md flex items-center justify-center overflow-hidden">
                <MemoThreeCanvas
                  size="large"
                  mood={memoMood}
                  interactive={true}
                  showControlsOverlay={true}
                  soundEnabled={studyConfig.audioFeedback}
                  customColorPreset={colorPreset}
                  halloweenTheme={memoHalloweenTheme}
                  className="w-full h-full"
                />
              </div>

              {/* Halloween Special Outfit Card */}
              <div className="w-full max-w-[280px] sm:max-w-xs p-3.5 rounded-2xl bg-gradient-to-br from-purple-900/15 via-orange-950/20 to-purple-950/25 border border-orange-400/50 dark:border-orange-500/40 flex items-center justify-between gap-3 shadow-xs shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <WitchHat className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 flex-wrap">
                      <span>Halloween Theme</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-500 text-white uppercase tracking-wider">
                        Special
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate">
                      Witch Hat, Vampire Teeth & Spooky Glow
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toggleMemoHalloweenTheme();
                    if (!memoHalloweenTheme) {
                      setColorPreset('halloween');
                    }
                    playCalmChime(studyConfig.audioFeedback);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    memoHalloweenTheme
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                  }`}
                >
                  {memoHalloweenTheme ? 'Equipped' : 'Equip'}
                </button>
              </div>

              {/* Interactive Emotes Trigger Buttons */}
              <div className="w-full max-w-[280px] sm:max-w-xs space-y-2 shrink-0">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Emote & React (Animations)
                </div>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    onClick={() => {
                      setMemoMood('scholar');
                      setColorPreset('scholar-gold');
                      playCalmChime(studyConfig.audioFeedback);
                    }}
                    className="py-1.5 px-1.5 bg-[#FAF6EE] dark:bg-[#2A231B] rounded-xl border border-[#D4AF37]/60 text-xs text-[#8C6239] dark:text-[#E6C687] font-semibold hover:border-[#D4AF37] transition-colors cursor-pointer text-center"
                    title="Scholar Spectacles & Studious Reading"
                  >
                    Scholar
                  </button>
                  <button
                    onClick={() => {
                      setMemoMood('celebrate');
                      playCalmChime(studyConfig.audioFeedback);
                    }}
                    className="py-1.5 px-1.5 bg-white dark:bg-slate-800 rounded-xl border border-amber-300 dark:border-amber-700 text-xs text-amber-700 dark:text-amber-300 font-semibold hover:border-amber-500 transition-colors cursor-pointer text-center"
                    title="Victory Spin & Joyful Flip"
                  >
                    Celebrate
                  </button>
                  <button
                    onClick={() => {
                      setMemoMood('cheer');
                      playCalmChime(studyConfig.audioFeedback);
                    }}
                    className="py-1.5 px-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-emerald-600 dark:text-emerald-400 hover:border-emerald-400 transition-colors cursor-pointer text-center"
                    title="Wave & Cheer"
                  >
                    Cheer
                  </button>
                  <button
                    onClick={() => {
                      setMemoMood('focus');
                      playSoftTap(studyConfig.audioFeedback);
                    }}
                    className="py-1.5 px-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-blue-600 dark:text-blue-400 hover:border-blue-400 transition-colors cursor-pointer text-center"
                    title="Deep Focus Breathing Wave"
                  >
                    Deep Focus
                  </button>
                  <button
                    onClick={() => {
                      setMemoMood('happy');
                      playCalmChime(studyConfig.audioFeedback);
                    }}
                    className="py-1.5 px-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-[#3A3F4F] dark:text-slate-300 hover:border-[#22D08B] hover:text-[#22D08B] transition-colors cursor-pointer text-center"
                  >
                    Happy
                  </button>
                  <button
                    onClick={() => {
                      setMemoMood('thinking');
                      playSoftTap(studyConfig.audioFeedback);
                    }}
                    className="py-1.5 px-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-[#3A3F4F] dark:text-slate-300 hover:border-[#2BA8F0] hover:text-[#2BA8F0] transition-colors cursor-pointer text-center"
                  >
                    Thinking
                  </button>
                </div>

                {/* Futuristic Lighting Color Presets */}
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2">
                  Lighting & Aura Theme
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {[
                    { id: 'scholar-gold', label: 'Scholar' },
                    { id: 'halloween', label: 'Spooky' },
                    { id: 'aurora', label: 'Aurora' },
                    { id: 'cyan', label: 'Cyan' },
                    { id: 'lime', label: 'Lime' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setColorPreset(p.id as any);
                        if (p.id === 'halloween' && !memoHalloweenTheme) {
                          toggleMemoHalloweenTheme();
                        }
                      }}
                      className={`py-1.5 px-1 rounded-xl border text-[11px] font-medium transition-all cursor-pointer text-center ${
                        colorPreset === p.id
                          ? p.id === 'scholar-gold'
                            ? 'border-[#D4AF37] bg-amber-50 dark:bg-amber-950/40 text-[#8C6239] dark:text-[#E6C687] font-semibold'
                            : p.id === 'halloween'
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-semibold'
                            : 'border-[#22D08B] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
