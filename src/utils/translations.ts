/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate English & Malayalam Language Translations
 * Simple, natural Malayalam designed for kids, teens, and students.
 */

export type AppLanguage = 'en' | 'ml';

export interface Translations {
  // Navigation & Tabs
  lessons: string;
  flashcards: string;
  reviewMistakes: string;
  finalQuiz: string;
  contentAudit: string;
  examPrep: string;
  pomodoro: string;
  memo: string;
  settings: string;
  feedback: string;
  newDocument: string;

  // Scholar Greeting & Dashboard
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  greetingSub: string;
  studyProgress: string;
  streak: string;
  streakDays: string;
  totalStudyTime: string;
  hours: string;
  minutes: string;
  quickActions: string;
  startQuiz: string;
  planStudy: string;
  addNote: string;
  browseLibrary: string;

  // Study Readiness / Prep
  studyPrepTitle: string;
  studyPrepSub: string;
  prepStep1Title: string;
  prepStep1Desc: string;
  prepStep2Title: string;
  prepStep2Desc: string;
  prepStep3Title: string;
  prepStep3Desc: string;
  prepStep4Title: string;
  prepStep4Desc: string;
  prepStep5Title: string;
  prepStep5Desc: string;
  readyToStudyButton: string;

  // Loading Screen Motivation
  loadingTitle: string;
  loadingSub: string;
  quoteLabel: string;
  tipLabel: string;
  factLabel: string;

  // Session Audio Player
  musicTitle: string;
  frequencyWaves: string;
  lofiBeats: string;
  rainyLibrary: string;
  solfeggioClarity: string;
  gammaFocus: string;
  nowPlaying: string;
  pauseMusic: string;
  playMusic: string;

  // Memo Companion
  memoGreeting: string;
  memoClearDoubts: string;
  askDoubtsTab: string;
  configTab: string;
  customizeTab: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    lessons: 'Lessons',
    flashcards: 'Flashcards',
    reviewMistakes: 'Review Mistakes',
    finalQuiz: 'Final Quiz',
    contentAudit: 'Content Audit',
    examPrep: 'Exam Prep Mode',
    pomodoro: 'Pomodoro',
    memo: 'Memo',
    settings: 'Settings',
    feedback: 'Feedback',
    newDocument: 'New Document',

    greetingMorning: 'Good morning, Scholar.',
    greetingAfternoon: 'Good afternoon, Scholar.',
    greetingEvening: 'Good evening, Scholar.',
    greetingSub: "Keep going. You're doing great.",
    studyProgress: 'Study Progress',
    streak: 'Streak',
    streakDays: 'days',
    totalStudyTime: 'Total Study',
    hours: 'h',
    minutes: 'm',
    quickActions: 'Quick Actions',
    startQuiz: 'Start Quiz',
    planStudy: 'Plan Study',
    addNote: 'Add Note',
    browseLibrary: 'Browse Library',

    studyPrepTitle: 'Study Readiness Guide',
    studyPrepSub: 'Take a moment to prepare your space and mind for calm, deep learning.',
    prepStep1Title: 'Find a calm space for study',
    prepStep1Desc: 'Pick a quiet, comfortable corner with good light so your mind feels at ease.',
    prepStep2Title: 'Put on headphones to avoid distraction',
    prepStep2Desc: 'Block sudden background noises to keep your focus unbroken.',
    prepStep3Title: 'Keep water nearby',
    prepStep3Desc: 'A hydrated brain thinks faster, stays alert, and avoids tiredness.',
    prepStep4Title: 'Set your phone to silent',
    prepStep4Desc: 'Mute rings and notifications for just 25 minutes of deep flow.',
    prepStep5Title: 'Take 3 deep, slow breaths',
    prepStep5Desc: 'Relax your shoulders and breathe out slowly. You are completely ready!',
    readyToStudyButton: 'I am ready, start studying!',

    loadingTitle: 'Crafting Your Study Course',
    loadingSub: 'Preparing clean bite-sized lessons so you learn smoothly with zero overwhelm.',
    quoteLabel: 'Thought for Today',
    tipLabel: 'Study Tip',
    factLabel: 'Brain Science Fact',

    musicTitle: 'Focus Session Audio',
    frequencyWaves: '432 Hz Alpha Waves',
    lofiBeats: 'Lo-Fi Chill Beats',
    rainyLibrary: 'Rainy Campus Library',
    solfeggioClarity: '528 Hz Clarity Tone',
    gammaFocus: '40 Hz Deep Gamma',
    nowPlaying: 'Now Playing',
    pauseMusic: 'Pause Sound',
    playMusic: 'Play Focus Music',

    memoGreeting: 'Hi! I am Memo, your 3D study companion.',
    memoClearDoubts: 'Ready to clear doubts and guide your pace.',
    askDoubtsTab: 'Ask Doubts',
    configTab: 'Configurations',
    customizeTab: 'Memo Customize',
  },

  ml: {
    lessons: 'പാഠങ്ങൾ',
    flashcards: 'ഫ്ലാഷ്‌കാർഡുകൾ',
    reviewMistakes: 'തെറ്റുകൾ തിരുത്താം',
    finalQuiz: 'ഫൈനൽ ക്വിസ്',
    contentAudit: 'കണ്ടന്റ് ഓഡിറ്റ്',
    examPrep: 'പരീക്ഷാ ഒരുക്കം',
    pomodoro: 'പോമോഡോറോ',
    memo: 'മെമോ',
    settings: 'ക്രമീകരണങ്ങൾ',
    feedback: 'അഭിപ്രായം',
    newDocument: 'പുതിയ ഡോക്യുമെന്റ്',

    greetingMorning: 'ശുഭോദയം, പഠിതാവേ.',
    greetingAfternoon: 'ശുഭദിനം, പഠിതാവേ.',
    greetingEvening: 'ശുഭസായാഹ്നം, പഠിതാവേ.',
    greetingSub: 'തുടർന്നുപഠിക്കൂ, നിങ്ങൾ വളരെ നന്നായി ചെയ്യുന്നുണ്ട്.',
    studyProgress: 'പഠന പുരോഗതി',
    streak: 'തുടർച്ചയായ പഠനം',
    streakDays: 'ദിവസങ്ങൾ',
    totalStudyTime: 'ആകെ പഠിച്ച സമയം',
    hours: 'മണിക്കൂർ',
    minutes: 'മിനിറ്റ്',
    quickActions: 'പെട്ടെന്നുള്ള വഴികൾ',
    startQuiz: 'ക്വിസ് തുടങ്ങാം',
    planStudy: 'പഠനം പ്ലാൻ ചെയ്യാം',
    addNote: 'കുറിപ്പ് എഴുതാം',
    browseLibrary: 'ലൈബ്രറി കാണാം',

    studyPrepTitle: 'പഠനത്തിന് തയ്യാറെടുക്കാം',
    studyPrepSub: 'മനസ്സും ചുറ്റുപാടും ശാന്തമാക്കി പഠനം തുടങ്ങാനുള്ള ലളിതമായ വഴികൾ.',
    prepStep1Title: 'ശാന്തമായ ഒരു പഠനസ്ഥലം കണ്ടെത്തൂ',
    prepStep1Desc: 'നല്ല വെളിച്ചവും വായുസഞ്ചാരവുമുള്ള ഒരു സുഖകരമായ ഇടം തിരഞ്ഞെടുക്കൂ.',
    prepStep2Title: 'ശ്രദ്ധ തിരിയാതിരിക്കാൻ ഹെഡ്ഫോൺ വെയ്ക്കൂ',
    prepStep2Desc: 'പുറത്തുനിന്നുള്ള ബഹളങ്ങൾ കേൾക്കാതിരിക്കാൻ ഹെഡ്ഫോൺ ധരിക്കുന്നത് സഹായിക്കും.',
    prepStep3Title: 'കുടിവെള്ളം അടുത്തു വെയ്ക്കൂ',
    prepStep3Desc: 'ഇടയ്ക്കിടെ അല്പം വെള്ളം കുടിക്കുന്നത് തലച്ചോറിന് ഉന്മേഷവും കൂടുതൽ ശ്രദ്ധയും നൽകും.',
    prepStep4Title: 'ഫോൺ സൈലന്റ് ആക്കി വെയ്ക്കൂ',
    prepStep4Desc: 'പഠിക്കുന്ന സമയം മെസ്സേജ് സൗണ്ടുകൾ ഓഫ് ചെയ്യുന്നത് പഠനം വേഗത്തിലാക്കും.',
    prepStep5Title: '3 തവണ ദീർഘമായി ശ്വാസമെടുക്കൂ',
    prepStep5Desc: 'ശരീരം അയച്ച് സാവധാനം ശ്വാസമെടുക്കൂ. നിങ്ങൾ പഠിക്കാൻ പൂർണ്ണമായും തയ്യാറാണ്!',
    readyToStudyButton: 'ഞാൻ തയ്യാർ, പഠനം തുടങ്ങാം!',

    loadingTitle: 'നിങ്ങളുടെ പാഠങ്ങൾ ഒരുക്കുന്നു',
    loadingSub: 'ബുദ്ധിമുട്ടില്ലാതെ വേഗത്തിൽ പഠിക്കാൻ പാഠങ്ങൾ ലളിതമാക്കുകയാണ് മെമോ.',
    quoteLabel: 'ഇന്നത്തെ നല്ല ചിന്ത',
    tipLabel: 'പഠന സൂത്രം',
    factLabel: 'തലച്ചോറിനെക്കുറിച്ചുള്ള അറിവ്',

    musicTitle: 'പഠന പശ്ചാത്തല സംഗീതം',
    frequencyWaves: '432 Hz ആൽഫ തരംഗങ്ങൾ',
    lofiBeats: 'ലോ-ഫൈ ശാന്ത ഈണങ്ങൾ',
    rainyLibrary: 'മഴയൊച്ചയുള്ള ലൈബ്രറി',
    solfeggioClarity: '528 Hz മനസ്സ് തെളിയുന്ന ഈണം',
    gammaFocus: '40 Hz ഗാമ ഏകാഗ്രത',
    nowPlaying: 'ഇപ്പോൾ കേൾക്കുന്നത്',
    pauseMusic: 'മ്യൂസിക് നിർത്താം',
    playMusic: 'സംഗീതം കേൾക്കാം',

    memoGreeting: 'ഹലോ! ഞാൻ മെമോ, നിങ്ങളുടെ 3D പഠന സഹായി.',
    memoClearDoubts: 'സംശയങ്ങൾ ചോദിക്കാനും പഠനം ലളിതമാക്കാനും ഞാൻ തയ്യാറാണ്.',
    askDoubtsTab: 'സംശയങ്ങൾ',
    configTab: 'ക്രമീകരണങ്ങൾ',
    customizeTab: 'മെമോ സ്റ്റൈൽ',
  },
};
