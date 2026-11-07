/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Feedback Modal
 * Dedicated feedback panel allowing students and users to suggest improvements,
 * report bugs, and rate their study experience.
 */

import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Star,
  CheckCircle2,
  AlertCircle,
  Send,
  Heart,
  Lightbulb,
} from './icons.tsx';
import type { FeedbackRecord } from '../types.ts';
import { playCalmChime, playSoftTap } from '../utils/audioChimes.ts';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  audioEnabled?: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
  audioEnabled = true,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [sentiment, setSentiment] = useState<'loved' | 'great' | 'good' | 'okay' | 'confusing'>('loved');
  const [category, setCategory] = useState<'feature' | 'quality' | 'pacing' | 'design' | 'bug' | 'other'>('feature');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState(defaultEmail);
  const [userName, setUserName] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickChips = [
    'Memo 3D companion is awesome',
    'Bite-sized chunks are very calm',
    'Would like more practice quizzes',
    'Want faster outline generation',
    'Simpler words mode is super helpful',
    'Font size scaling works great',
  ];

  const handleChipToggle = (chip: string) => {
    playSoftTap(audioEnabled);
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
      if (!message.includes(chip)) {
        setMessage((prev) => (prev ? `${prev}\n• ${chip}` : `• ${chip}`));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage('Please share a few words about your experience.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const feedbackPayload: Partial<FeedbackRecord> = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      rating,
      sentiment,
      category,
      message: message.trim(),
      userEmail: userEmail.trim() || defaultEmail || 'student@studymate.app',
      userName: userName.trim() || 'StudyMate Student',
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    try {
      // 1. Submit to server endpoint
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload),
      });

      // 2. Also persist in localStorage
      try {
        const existing = localStorage.getItem('studymate_feedbacks');
        const parsed = existing ? JSON.parse(existing) : [];
        parsed.unshift(feedbackPayload);
        localStorage.setItem('studymate_feedbacks', JSON.stringify(parsed));
      } catch {}

      playCalmChime(audioEnabled);
      setIsSubmitted(true);
    } catch {
      // Local fallback
      try {
        const existing = localStorage.getItem('studymate_feedbacks');
        const parsed = existing ? JSON.parse(existing) : [];
        parsed.unshift(feedbackPayload);
        localStorage.setItem('studymate_feedbacks', JSON.stringify(parsed));
      } catch {}
      playCalmChime(audioEnabled);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setMessage('');
    setSelectedChips([]);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div className="bg-white dark:bg-[#161A22] rounded-3xl max-w-lg w-full border border-zinc-200/90 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-2xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="feedback-title" className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Feedback & Suggestions
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Help us make StudyMate calmer, clearer, and more helpful
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close feedback dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 sm:p-10 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Thank you for your thoughts!
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Your feedback has been logged directly into the StudyMate administration panel. We review every note to make the learning experience simpler and calmer.
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#1A6EF0] hover:bg-[#1558C4] text-white shadow-xs cursor-pointer transition-colors"
              >
                Back to Learning
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Rating / Sentiment Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                How is your study experience?
              </label>

              <div className="grid grid-cols-5 gap-2">
                {[
                  { stars: 5, sent: 'loved', label: 'Loved it' },
                  { stars: 4, sent: 'great', label: 'Great' },
                  { stars: 3, sent: 'good', label: 'Good' },
                  { stars: 2, sent: 'okay', label: 'Okay' },
                  { stars: 1, sent: 'confusing', label: 'Confusing' },
                ].map((item) => (
                  <button
                    key={item.sent}
                    type="button"
                    onClick={() => {
                      setRating(item.stars);
                      setSentiment(item.sent as any);
                      playSoftTap(audioEnabled);
                    }}
                    className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                      sentiment === item.sent
                        ? 'border-[#1A6EF0] bg-[#1A6EF0]/10 text-[#1A6EF0] dark:text-[#64B5F6] font-bold shadow-2xs'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-center text-amber-500 mb-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[10px] font-bold ml-0.5">{item.stars}</span>
                    </div>
                    <div className="text-[10px] truncate">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Topic
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'feature', label: 'Feature Request' },
                  { id: 'quality', label: 'Study & Quiz Quality' },
                  { id: 'pacing', label: 'Simpler Words & Pacing' },
                  { id: 'design', label: 'Design & Visuals' },
                  { id: 'bug', label: 'Bug / Issue' },
                  { id: 'other', label: 'Other Suggestion' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id as any);
                      playSoftTap(audioEnabled);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      category === cat.id
                        ? 'bg-[#1A6EF0] text-white shadow-2xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Chips */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Quick Prompts (Tap to add)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickChips.map((chip) => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipToggle(chip)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Feedback Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Your Thoughts
              </label>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                rows={4}
                placeholder="What worked well? What felt overwhelming or can be improved?"
                className="w-full p-3.5 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs sm:text-sm focus:outline-hidden focus:border-[#1A6EF0] focus:ring-2 focus:ring-[#1A6EF0]/20 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Contact Email Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Your Email (Optional)
                </label>
                <span className="text-[10px] text-zinc-400">So we can follow up</span>
              </div>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="alex.scholar@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-hidden focus:border-[#1A6EF0]"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-[#1A6EF0] hover:bg-[#1558C4] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Sending feedback...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Feedback</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
