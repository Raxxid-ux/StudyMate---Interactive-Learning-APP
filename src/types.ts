/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudyChunk {
  id: string;
  title: string;
  content: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
  question: string;
  options: string[];
  correctAnswer: string;
  sourceQuote: string;
  sectionIndex: number;
  sectionTitle: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface StepItem {
  type: 'process' | 'timeline' | 'comparison';
  title: string;
  items: Array<{
    label: string;
    detail: string;
  }>;
}

export interface SectionLesson {
  intro: string;
  chunks: StudyChunk[];
  keyPoints: string[];
  questions: Question[];
  glossary: GlossaryItem[];
  steps: StepItem[];
  skippedItems: string[];
  plainWords?: string;
}

export interface Section {
  sectionIndex: number;
  title: string;
  mergedParts: string[];
  content: string;
  status: 'pending' | 'building' | 'ready' | 'error';
  lesson?: SectionLesson;
  errorMessage?: string;
}

export interface CourseData {
  id: string;
  documentTitle: string;
  fileName: string;
  sections: Section[];
  skippedContent: string[];
  firstSentence: string;
  lastSentence: string;
  createdAt: string;
}

export interface MistakeRecord {
  questionId: string;
  question: Question;
  studentAnswer: string;
  recordedAt: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  revealed: boolean;
}

export interface CourseProgress {
  courseId: string;
  completedSectionIndices: number[];
  sectionAnswers: Record<string, QuizAnswer>;
  mistakes: MistakeRecord[];
}
