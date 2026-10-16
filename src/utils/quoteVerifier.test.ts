import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeTextForCheck,
  verifyQuoteInText,
  verifyKeyPoints,
  filterValidQuestions,
  enforceMaxSections,
  type QuestionData
} from './quoteVerifier.ts';

test('normalizeTextForCheck collapses extra whitespace and line breaks', () => {
  const input = 'This   is a\n\ntest\r\nline with\t tabs.';
  const expected = 'This is a test line with tabs.';
  assert.equal(normalizeTextForCheck(input), expected);
});

test('verifyQuoteInText returns true when quote matches across newlines and spaces', () => {
  const sectionText = `
    Photosynthesis is the process by which green plants transform light energy into chemical energy.
    During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide,
    and minerals into oxygen and energy-rich organic compounds.
  `;
  const exactQuote = 'Photosynthesis is the process by which green plants transform light energy into chemical energy.';
  assert.equal(verifyQuoteInText(exactQuote, sectionText), true);

  const quoteAcrossLines = 'During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.';
  assert.equal(verifyQuoteInText(quoteAcrossLines, sectionText), true);
});

test('verifyQuoteInText returns false when quote has altered words', () => {
  const sectionText = 'Photosynthesis is the process by which green plants transform light energy into chemical energy.';
  const alteredQuote = 'Photosynthesis is how plants turn sunlight into food.';
  assert.equal(verifyQuoteInText(alteredQuote, sectionText), false);
});

test('verifyKeyPoints filters points correctly', () => {
  const section = 'The mitochondria is the powerhouse of the cell. Ribosomes perform protein synthesis.';
  const points = [
    'The mitochondria is the powerhouse of the cell.',
    'Chloroplasts are only in plant cells.', // outside fact
    'Ribosomes perform protein synthesis.'
  ];
  const result = verifyKeyPoints(points, section);
  assert.equal(result.valid.length, 2);
  assert.equal(result.invalid.length, 1);
  assert.equal(result.invalid[0], 'Chloroplasts are only in plant cells.');
});

test('filterValidQuestions keeps only questions with exact sourceQuote', () => {
  const section = 'The Pacific Ocean is the largest and deepest ocean basin on Earth.';
  const questions: QuestionData[] = [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Which ocean is the largest on Earth?',
      options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'],
      correctAnswer: 'Pacific',
      sourceQuote: 'The Pacific Ocean is the largest and deepest ocean basin on Earth.'
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'The Atlantic is the deepest ocean.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      sourceQuote: 'The Atlantic Ocean is known for its shallow trenches.' // not in text
    }
  ];

  const result = filterValidQuestions(questions, section);
  assert.equal(result.valid.length, 1);
  assert.equal(result.valid[0].id, 'q1');
  assert.equal(result.invalid.length, 1);
  assert.equal(result.invalid[0].question.id, 'q2');
});

test('enforceMaxSections compresses >8 sections down to 8 or fewer', () => {
  const tenSections = Array.from({ length: 10 }, (_, i) => ({
    title: `Section ${i + 1}`,
    content: `Content for section ${i + 1}`,
    mergedParts: [`Part ${i + 1}`],
  }));

  const consolidated = enforceMaxSections(tenSections, 8);
  assert.equal(consolidated.length, 8);
  assert.ok(consolidated.some((s) => s.mergedParts.length > 1));
});
