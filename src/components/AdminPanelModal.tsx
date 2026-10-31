/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Admin Panel Modal
 * Provides secured administrative insights under the About Me section:
 * - Uploads analytics & count
 * - Full inspection of uploaded document contents
 * - User accounts and session directory
 * - User feedback inbox and review workflow
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  Key,
  FileText,
  Users,
  MessageCircle,
  BarChart3,
  Trash2,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Star,
  ExternalLink,
} from './icons.tsx';
import type { UploadLogRecord, FeedbackRecord, UserSessionRecord } from '../types.ts';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCourseCleanedText?: string;
  currentCourseTitle?: string;
  onOpenFeedback?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentCourseCleanedText,
  currentCourseTitle,
  onOpenFeedback,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('studymate_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab inside Admin Panel
  const [activeTab, setActiveTab] = useState<'overview' | 'uploads' | 'users' | 'feedback'>('overview');

  // Data states
  const [uploads, setUploads] = useState<UploadLogRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [users, setUsers] = useState<UserSessionRecord[]>([]);
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalFiles: 0,
    totalSections: 0,
    totalUsers: 0,
    totalFeedbacks: 0,
    averageRating: '5.0',
  });
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Search & Content inspection modal
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingUpload, setInspectingUpload] = useState<UploadLogRecord | null>(null);
  const [confirmClearLogs, setConfirmClearLogs] = useState(false);

  // Load admin data when open & authenticated
  const fetchAdminData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch from backend API
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const data = await res.json();
        setUploads(data.uploads || []);
        setFeedbacks(data.feedbacks || []);
        setUsers(data.users || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        // Fallback to local storage if API is offline
        loadFromLocalStorage();
      }
    } catch {
      loadFromLocalStorage();
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const storedUploads = localStorage.getItem('studymate_admin_uploads');
      const storedFeedbacks = localStorage.getItem('studymate_feedbacks');
      const parsedUploads = storedUploads ? JSON.parse(storedUploads) : [];
      const parsedFeedbacks = storedFeedbacks ? JSON.parse(storedFeedbacks) : [];

      setUploads(parsedUploads);
      setFeedbacks(parsedFeedbacks);
      setStats({
        totalUploads: parsedUploads.length,
        totalFiles: parsedUploads.reduce((acc: number, u: any) => acc + (u.fileNames?.length || 1), 0),
        totalSections: parsedUploads.reduce((acc: number, u: any) => acc + (u.sectionCount || 1), 0),
        totalUsers: 2,
        totalFeedbacks: parsedFeedbacks.length,
        averageRating: '5.0',
      });
    } catch (e) {
      console.warn('Could not read admin data from local storage', e);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchAdminData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Handle password submission
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Validate the designated security key
    const targetKey = '9656756757';
    if (passwordInput.trim() === targetKey) {
      setIsAuthenticated(true);
      sessionStorage.setItem('studymate_admin_auth', 'true');
      setPasswordInput('');
      fetchAdminData();
    } else {
      setAuthError('Incorrect security key. Access restricted.');
      setPasswordInput('');
    }
  };

  const handleLockPanel = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('studymate_admin_auth');
    setPasswordInput('');
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/admin/clear-logs', { method: 'POST' });
    } catch {}
    localStorage.removeItem('studymate_admin_uploads');
    localStorage.removeItem('studymate_feedbacks');
    setUploads([]);
    setFeedbacks([]);
    setConfirmClearLogs(false);
    fetchAdminData();
  };

  const handleExportData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      stats,
      uploads,
      feedbacks,
      users,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymate_admin_audit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter uploads based on search
  const filteredUploads = uploads.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.documentTitle.toLowerCase().includes(q) ||
      u.fileNames.some((f) => f.toLowerCase().includes(q)) ||
      u.userEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#161A22] rounded-3xl max-w-4xl w-full border border-zinc-200/90 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Strip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="admin-title" className="text-base sm:text-lg font-bold text-[#3A3F4F] dark:text-[#F1F3F7] tracking-tight">
                  Admin System Portal
                </h2>
                {isAuthenticated && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    Authenticated
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9]">
                System metrics, upload history, user sessions, and feedback audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLockPanel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Lock admin session"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Panel</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close admin panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE SCREEN */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shadow-inner border border-zinc-200 dark:border-zinc-700">
              <Lock className="w-8 h-8 text-[#1A6EF0]" />
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Administrator Verification
              </h3>
              <p className="text-xs text-[#5F6573] dark:text-[#A6ACB9] leading-relaxed">
                This portal provides authorized oversight on uploaded document contents, active users, and system feedback.
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="w-full max-w-xs space-y-3">
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter security key..."
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-hidden focus:border-[#1A6EF0] focus:ring-2 focus:ring-[#1A6EF0]/20 transition-all text-center tracking-widest font-mono"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!passwordInput.trim()}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-[#1A6EF0] text-white hover:bg-[#1558C4] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Verify and Unlock</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 py-2 bg-zinc-100/60 dark:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800/60 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-white dark:bg-[#1F2430] text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Overview & Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('uploads')}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'uploads'
                    ? 'bg-white dark:bg-[#1F2430] text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Uploads & Contents</span>
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  {uploads.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'bg-white dark:bg-[#1F2430] text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Users & Activity</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  {users.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('feedback')}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'feedback'
                    ? 'bg-white dark:bg-[#1F2430] text-[#1A6EF0] dark:text-[#64B5F6] shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>User Feedbacks</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                  {feedbacks.length}
                </span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: OVERVIEW & METRICS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#5F6573] dark:text-[#A6ACB9]">
                        Total Uploads
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#3A3F4F] dark:text-[#F1F3F7] tabular-nums">
                        {uploads.length}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Active study curricula
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#5F6573] dark:text-[#A6ACB9]">
                        Files Processed
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#1A6EF0] dark:text-[#64B5F6] tabular-nums">
                        {uploads.reduce((acc, u) => acc + (u.fileNames?.length || 1), 0)}
                      </div>
                      <div className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9] font-medium">
                        PDFs, TXT & Markdown
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#5F6573] dark:text-[#A6ACB9]">
                        Active Users
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {users.length || 2}
                      </div>
                      <div className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9] font-medium">
                        Active Scholars & Learners
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#5F6573] dark:text-[#A6ACB9]">
                        User Feedbacks
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                        {feedbacks.length}
                      </div>
                      <div className="text-[11px] text-[#5F6573] dark:text-[#A6ACB9] font-medium">
                        Rating: {stats.averageRating} / 5.0
                      </div>
                    </div>
                  </div>

                  {/* Quick Summary Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Latest Uploads Snippet */}
                    <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#1A6EF0]" />
                          <span>Recent Upload Highlights</span>
                        </h4>
                        <button
                          onClick={() => setActiveTab('uploads')}
                          className="text-xs text-[#1A6EF0] font-semibold hover:underline cursor-pointer"
                        >
                          View all ({uploads.length})
                        </button>
                      </div>

                      <div className="space-y-2">
                        {uploads.slice(0, 3).map((up) => (
                          <div
                            key={up.id}
                            className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                {up.documentTitle}
                              </p>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                                {up.fileNames.join(', ')} · {up.sectionCount} lessons
                              </p>
                            </div>
                            <button
                              onClick={() => setInspectingUpload(up)}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-[11px] font-semibold text-zinc-700 dark:text-zinc-200 hover:text-[#1A6EF0] cursor-pointer shrink-0"
                            >
                              Inspect
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Latest Feedbacks Snippet */}
                    <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#3A3F4F] dark:text-[#F1F3F7] flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Latest User Feedback</span>
                        </h4>
                        <button
                          onClick={() => setActiveTab('feedback')}
                          className="text-xs text-[#1A6EF0] font-semibold hover:underline cursor-pointer"
                        >
                          View all ({feedbacks.length})
                        </button>
                      </div>

                      <div className="space-y-2">
                        {feedbacks.slice(0, 3).map((fb) => (
                          <div
                            key={fb.id}
                            className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(fb.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                                <span className="text-[10px] uppercase font-bold tracking-wider ml-1 text-zinc-500">
                                  {fb.category}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400">
                                {new Date(fb.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300 italic line-clamp-2">
                              "{fb.message}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: UPLOADS & CONTENT ARCHIVE */}
              {activeTab === 'uploads' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search document title or files..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#1A6EF0]"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {filteredUploads.length} uploads found
                      </span>
                      <button
                        onClick={fetchAdminData}
                        className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer"
                        title="Refresh upload list"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Uploads List Table / Cards */}
                  <div className="space-y-3">
                    {filteredUploads.length === 0 ? (
                      <div className="text-center py-12 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-dashed border-zinc-200 dark:border-zinc-800">
                        <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                          No uploads match your search
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          All new documents uploaded on the home screen will automatically log here.
                        </p>
                      </div>
                    ) : (
                      filteredUploads.map((up) => (
                        <div
                          key={up.id}
                          className="p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-[#1A6EF0]/50 transition-all space-y-3 shadow-2xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                                {up.documentTitle}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                <span className="font-medium text-[#1A6EF0] dark:text-[#64B5F6]">
                                  {up.userEmail}
                                </span>
                                <span>•</span>
                                <span>{new Date(up.uploadedAt).toLocaleString()}</span>
                                <span>•</span>
                                <span>{up.sectionCount} sections</span>
                                <span>•</span>
                                <span>{(up.totalSize / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setInspectingUpload(up)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A6EF0]/10 text-[#1A6EF0] dark:text-[#64B5F6] hover:bg-[#1A6EF0]/20 font-semibold text-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Content</span>
                            </button>
                          </div>

                          {/* Source Files Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {up.fileNames.map((fname, fidx) => (
                              <span
                                key={fidx}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                              >
                                <FileText className="w-3 h-3 text-zinc-400" />
                                <span className="truncate max-w-[200px]">{fname}</span>
                              </span>
                            ))}
                          </div>

                          {/* Content Snippet */}
                          {up.contentSnippet && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                              "{up.contentSnippet}"
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: USERS & ACTIVITY DIRECTORY */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Active student profiles and creators utilizing StudyMate:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users.map((usr) => (
                      <div
                        key={usr.id}
                        className="p-5 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                              {usr.name ? usr.name.slice(0, 2).toUpperCase() : 'ST'}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                                {usr.name}
                              </h4>
                              <p className="text-xs text-[#1A6EF0] dark:text-[#64B5F6] font-medium">
                                {usr.email}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              usr.role === 'creator'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            {usr.role}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
                          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/40">
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {usr.uploadCount}
                            </div>
                            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Uploads</div>
                          </div>
                          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/40">
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {usr.lessonsCompleted}
                            </div>
                            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Lessons</div>
                          </div>
                          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/40">
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              Active
                            </div>
                            <div className="text-[10px] text-emerald-500 uppercase font-semibold">Status</div>
                          </div>
                        </div>

                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-0.5 pt-1">
                          <div>Device: {usr.deviceType}</div>
                          <div>Last Seen: {new Date(usr.lastActive).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: USER FEEDBACKS */}
              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      User submitted suggestions, bug reports, and reviews:
                    </p>
                    {onOpenFeedback && (
                      <button
                        onClick={onOpenFeedback}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Submit New Feedback</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {feedbacks.length === 0 ? (
                      <div className="text-center py-12 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-dashed border-zinc-200 dark:border-zinc-800">
                        <MessageCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                          No feedback submissions yet
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Users can share feedback anytime via the Feedback button in the navigation bar.
                        </p>
                      </div>
                    ) : (
                      feedbacks.map((fb) => (
                        <div
                          key={fb.id}
                          className="p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center text-amber-500">
                                {[...Array(fb.rating)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                                {fb.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                              <span>{fb.userEmail || 'Anonymous'}</span>
                              <span>•</span>
                              <span>{new Date(fb.submittedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                            "{fb.message}"
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Admin Actions Strip */}
            <div className="px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/60 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-[#1A6EF0] transition-colors cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                {!confirmClearLogs ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClearLogs(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear logs</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 p-1 rounded-xl">
                    <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold px-2">
                      Confirm clear?
                    </span>
                    <button
                      type="button"
                      onClick={handleClearLogs}
                      className="px-2 py-0.5 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 cursor-pointer"
                    >
                      Yes, clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearLogs(false)}
                      className="px-2 py-0.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-[11px] font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1A6EF0] hover:bg-[#1558C4] text-white shadow-xs transition-colors cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* INSPECT CONTENT SUB-MODAL */}
      {inspectingUpload && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setInspectingUpload(null)}
        >
          <div
            className="bg-white dark:bg-[#161A22] rounded-3xl max-w-2xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="min-w-0 pr-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                  {inspectingUpload.documentTitle}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {inspectingUpload.fileNames.join(', ')} · {(inspectingUpload.totalSize / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => setInspectingUpload(null)}
                className="p-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Full Cleaned Content
                </span>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 max-h-80 overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
                  {inspectingUpload.fullCleanedText || inspectingUpload.contentSnippet || 'Content not cached.'}
                </div>
              </div>

              {inspectingUpload.skippedItems && inspectingUpload.skippedItems.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Skipped Items Audit ({inspectingUpload.skippedItems.length})
                  </span>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {inspectingUpload.skippedItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setInspectingUpload(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
