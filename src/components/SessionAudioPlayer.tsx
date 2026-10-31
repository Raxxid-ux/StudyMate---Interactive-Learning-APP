/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Session Audio Player Component
 * Provides Frequency Waves (432Hz, 528Hz, 40Hz) and Lo-Fi Study Beats.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  ChevronDown,
  Headphones,
  Sliders,
  Check,
} from './icons.tsx';
import {
  sessionAudio,
  AUDIO_TRACKS,
  type AudioTrackId,
} from '../utils/sessionAudioEngine.ts';
import { useThemeAndText } from '../context/ThemeAndTextContext.tsx';
import { playSoftTap } from '../utils/audioChimes.ts';

export const SessionAudioPlayer: React.FC = () => {
  const { t, language, theme } = useThemeAndText();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackId, setCurrentTrackId] = useState<AudioTrackId>('432hz');
  const [volume, setVolume] = useState<number>(0.5);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePlay = () => {
    playSoftTap(true);
    if (isPlaying) {
      sessionAudio.stop();
      setIsPlaying(false);
    } else {
      sessionAudio.play(currentTrackId);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (trackId: AudioTrackId) => {
    playSoftTap(true);
    setCurrentTrackId(trackId);
    if (isPlaying) {
      sessionAudio.play(trackId);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sessionAudio.setVolume(val);
  };

  const currentTrack = AUDIO_TRACKS.find((tr) => tr.id === currentTrackId) || AUDIO_TRACKS[0];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Mini Audio Dock Button in Navbar */}
      <div
        className={`flex items-center gap-1.5 p-1 pl-2.5 pr-1.5 rounded-2xl border transition-all text-xs font-medium shadow-2xs ${
          isPlaying
            ? theme === 'academia'
              ? 'bg-[#EAE2D2] dark:bg-[#2A231B] border-[#C5A059] text-[#4A3728] dark:text-[#E8CE9D]'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
            : theme === 'academia'
            ? 'bg-[#F2ECE1] dark:bg-[#1E1914] border-[#DECFC0] dark:border-[#382E25] text-[#5A4B3E] dark:text-[#D5C6B7] hover:border-[#C5A059]'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
        }`}
      >
        <button
          type="button"
          onClick={togglePlay}
          className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? theme === 'academia'
                ? 'bg-[#8C6239] text-[#F9F6EE]'
                : 'bg-[#22D08B] text-white shadow-xs'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105'
          }`}
          title={isPlaying ? t.pauseMusic : t.playMusic}
          aria-label={isPlaying ? 'Pause focus music' : 'Play focus music'}
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5" />
          )}
        </button>

        {/* Audio Wave animation when playing */}
        {isPlaying && (
          <div className="flex items-center gap-0.5 px-0.5">
            <span className="w-0.5 h-3 bg-current animate-pulse" />
            <span className="w-0.5 h-2 bg-current animate-pulse delay-75" />
            <span className="w-0.5 h-4 bg-current animate-pulse delay-150" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1.5 py-1 px-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          title="Select Focus Music (Frequencies or Lo-Fi)"
          aria-expanded={isDropdownOpen}
        >
          <Headphones className="w-3.5 h-3.5 opacity-70 shrink-0" />
          <span className="hidden sm:inline truncate max-w-[110px] text-[11px] font-semibold">
            {language === 'ml' ? currentTrack.nameMl : currentTrack.name}
          </span>
          <ChevronDown
            className={`w-3 h-3 opacity-60 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Popover Track Selector & Volume Controls */}
      {isDropdownOpen && (
        <div
          className={`absolute right-0 mt-2 w-72 sm:w-80 rounded-3xl border shadow-2xl p-4 z-50 space-y-3.5 animate-in fade-in zoom-in-95 duration-150 ${
            theme === 'academia'
              ? 'bg-[#F9F6EE] dark:bg-[#1E1914] border-[#DECFC0] dark:border-[#382E25] text-[#2B231D] dark:text-[#F3EAE0]'
              : 'bg-white dark:bg-[#1A1E27] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  theme === 'academia'
                    ? 'bg-[#C5A059]/20 text-[#8C6239] dark:text-[#E6C687]'
                    : 'bg-[#1A6EF0]/10 text-[#1A6EF0]'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
              </div>
              <h4
                className={`text-xs font-bold ${
                  theme === 'academia' ? 'font-serif-scholar text-sm' : ''
                }`}
              >
                {t.musicTitle}
              </h4>
            </div>

            <button
              type="button"
              onClick={togglePlay}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : theme === 'academia'
                  ? 'bg-[#8C6239] text-[#F9F6EE]'
                  : 'bg-[#1A6EF0] text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>

          {/* Track List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {AUDIO_TRACKS.map((track) => {
              const isSelected = track.id === currentTrackId;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track.id)}
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? theme === 'academia'
                        ? 'bg-[#EAE2D2] dark:bg-[#2A231B] border-[#C5A059] shadow-2xs'
                        : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-2xs'
                      : 'bg-transparent border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px] ${
                        isSelected
                          ? theme === 'academia'
                            ? 'border-[#8C6239] bg-[#8C6239] text-[#F9F6EE]'
                            : 'border-[#22D08B] bg-[#22D08B] text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold leading-tight ${
                          isSelected
                            ? theme === 'academia'
                              ? 'text-[#5E442B] dark:text-[#E8CE9D]'
                              : 'text-emerald-900 dark:text-emerald-200'
                            : ''
                        }`}
                      >
                        {language === 'ml' ? track.nameMl : track.name}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-500">
                        {track.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {track.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Volume</span>
              </span>
              <span className="font-mono">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#8C6239] dark:accent-[#C5A059]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
