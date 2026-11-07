/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Calm Pomodoro Timer
 * Provides structured interval pacing (25m Focus, 15m ADHD sprint, 5m break)
 * with audio chimes, visual progress ring, and calm non-judgmental tracking.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Zap,
} from './icons.tsx';
import { playCalmChime, playSoftTap } from '../utils/audioChimes.ts';

export type PomodoroMode = 'focus' | 'short-break' | 'long-break';

interface PomodoroTimerProps {
  compact?: boolean;
  onOpenFull?: () => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  compact = false,
  onOpenFull,
  isOpenModal = false,
  onCloseModal,
}) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [customFocusMinutes, setCustomFocusMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('studymate_pomodoro_sessions');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Calculate total seconds for current mode
  const getTotalSecondsForMode = (m: PomodoroMode, customFocus = customFocusMinutes) => {
    if (m === 'focus') return customFocus * 60;
    if (m === 'short-break') return 5 * 60;
    return 15 * 60;
  };

  // Switch modes
  const handleSwitchMode = (newMode: PomodoroMode, customMins = customFocusMinutes) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(getTotalSecondsForMode(newMode, customMins));
    playSoftTap(soundEnabled);
  };

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);

          // Audio chime on interval complete
          playCalmChime(soundEnabled);

          if (mode === 'focus') {
            const nextCount = sessionsCompletedToday + 1;
            setSessionsCompletedToday(nextCount);
            try {
              localStorage.setItem('studymate_pomodoro_sessions', String(nextCount));
            } catch {}
            // Switch to break
            const nextMode = nextCount % 4 === 0 ? 'long-break' : 'short-break';
            setMode(nextMode);
            return getTotalSecondsForMode(nextMode);
          } else {
            // Break finished, return to focus
            setMode('focus');
            return getTotalSecondsForMode('focus');
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, soundEnabled, sessionsCompletedToday, customFocusMinutes]);

  const handleTogglePlay = () => {
    playSoftTap(soundEnabled);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    playSoftTap(soundEnabled);
    setIsRunning(false);
    setSecondsLeft(getTotalSecondsForMode(mode));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSecs = getTotalSecondsForMode(mode);
  const progressPercent = Math.min(100, Math.max(0, ((totalSecs - secondsLeft) / totalSecs) * 100));

  // COMPACT NAVBAR WIDGET
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 h-8.5 sm:h-9 px-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 shadow-2xs">
        <button
          type="button"
          onClick={onOpenFull}
          className="flex items-center gap-1.5 cursor-pointer hover:text-[#1A6EF0] dark:hover:text-[#64B5F6] transition-colors"
          title="Open Pomodoro Timer"
        >
          <Timer className="w-3.5 h-3.5 text-[#1A6EF0] dark:text-[#64B5F6]" />
          <span className="font-mono text-xs font-bold tabular-nums">
            {formatTime(secondsLeft)}
          </span>
        </button>

        <button
          type="button"
          onClick={handleTogglePlay}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            isRunning
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
          }`}
          title={isRunning ? 'Pause Pomodoro' : 'Start Pomodoro'}
          aria-label={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
        </button>
      </div>
    );
  }

  // MODAL / FULL INTERFACE
  if (!isOpenModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pomodoro-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && onCloseModal) onCloseModal();
      }}
    >
      <div className="bg-white dark:bg-[#161A22] rounded-3xl max-w-md w-full border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#1A6EF0]/10 text-[#1A6EF0] dark:text-[#64B5F6] flex items-center justify-center">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 id="pomodoro-title" className="text-base font-bold text-zinc-900 dark:text-white">
                Study Pomodoro
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Paced, gentle intervals designed to prevent cognitive burnout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={soundEnabled ? 'Chime sound enabled' : 'Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {onCloseModal && (
              <button
                type="button"
                onClick={onCloseModal}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close Pomodoro"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => handleSwitchMode('focus')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'focus'
                ? 'bg-white dark:bg-zinc-900 text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Focus
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('short-break')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'short-break'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('long-break')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'long-break'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* ADHD Micro-Sprint Presets (When in Focus Mode) */}
        {mode === 'focus' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold px-1">
              <span>Sprint Duration:</span>
              <span className="text-[#1A6EF0] dark:text-[#64B5F6]">
                {customFocusMinutes === 15 ? 'ADHD Micro-Sprint' : customFocusMinutes === 25 ? 'Classic' : 'Deep Dive'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mins: 15, label: '15m Sprint', desc: 'ADHD low-friction' },
                { mins: 25, label: '25m Standard', desc: 'Classic pacing' },
                { mins: 45, label: '45m Deep', desc: 'Extended study' },
              ].map((p) => (
                <button
                  key={p.mins}
                  type="button"
                  onClick={() => {
                    setCustomFocusMinutes(p.mins);
                    handleSwitchMode('focus', p.mins);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    customFocusMinutes === p.mins
                      ? 'border-[#1A6EF0] bg-[#1A6EF0]/10 text-[#1A6EF0] dark:text-[#64B5F6] font-bold shadow-2xs'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] opacity-75">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Big Circular Clock Display */}
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={`${
                  mode === 'focus'
                    ? 'stroke-[#1A6EF0] dark:stroke-[#64B5F6]'
                    : mode === 'short-break'
                    ? 'stroke-emerald-500'
                    : 'stroke-indigo-500'
                } transition-all duration-500`}
                strokeWidth="6"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Centered Timer Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight tabular-nums">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-1">
                {mode === 'focus' ? 'Focus Session' : 'Rest & Breathe'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#1A6EF0] hover:bg-[#1558C4]'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Focus</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Daily Stats Pill */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Sessions Completed Today:</span>
          </div>
          <span className="font-bold text-zinc-900 dark:text-white tabular-nums">
            {sessionsCompletedToday} interval{sessionsCompletedToday === 1 ? '' : 's'} ({sessionsCompletedToday * customFocusMinutes}m)
          </span>
        </div>
      </div>
    </div>
  );
};
