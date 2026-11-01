/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Theme, Typography & Neurodiversity Context
 * Provides multi-theme configuration (Meadow Sage benchmark, Aurora, Cosmic, Sepia, High Contrast)
 * and specialized UI toolkits for ADHD & Dyslexia (Lexend font, Bionic Reading, Reading Ruler, Single-Chunk Focus).
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TRANSLATIONS, type AppLanguage, type Translations } from '../utils/translations.ts';

export type TextSize = 'normal' | 'large' | 'xlarge';
export type AppTheme = 'meadow' | 'cosmic' | 'high-contrast' | 'academia';
export type SupportStyle = 'calm' | 'structured' | 'gentle' | 'reflective' | 'direct';
export type UiDensity = 'classic' | 'compact' | 'minimal';

interface ThemeAndTextContextType {
  // Theme Controls
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  isDark: boolean;
  toggleTheme: () => void;

  // UI Density Mode (Classic, Compact, Minimal UI for reducing stress/overload)
  uiDensity: UiDensity;
  setUiDensity: (density: UiDensity) => void;
  cycleUiDensity: () => void;

  // Language (English & Simple Malayalam)
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: Translations;

  // Study Progress & Trackers
  totalStudyMinutes: number;
  studyStreakDays: number;
  incrementStudyMinutes: (mins?: number) => void;

  // Typography Size
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  fontSizeClass: string;

  // ADHD & Dyslexia Accessibility Suite
  dyslexicFont: boolean;
  setDyslexicFont: (enabled: boolean) => void;
  toggleDyslexicFont: () => void;

  bionicReading: boolean;
  setBionicReading: (enabled: boolean) => void;
  toggleBionicReading: () => void;

  readingRuler: boolean;
  setReadingRuler: (enabled: boolean) => void;
  toggleReadingRuler: () => void;

  singleChunkFocus: boolean;
  setSingleChunkFocus: (enabled: boolean) => void;
  toggleSingleChunkFocus: () => void;

  supportStyle: SupportStyle;
  setSupportStyle: (style: SupportStyle) => void;

  // Memo Halloween Special Outfit (Witch Hat & Vampire Teeth)
  memoHalloweenTheme: boolean;
  setMemoHalloweenTheme: (enabled: boolean) => void;
  toggleMemoHalloweenTheme: () => void;
}

const ThemeAndTextContext = createContext<ThemeAndTextContextType | undefined>(undefined);

export const ThemeAndTextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme State (Meadow Sage is benchmark default, supports Aurora, Cosmic, Sepia, High-Contrast, and Dark Academia)
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('studymate_theme_v2');
      if (saved && ['meadow', 'cosmic', 'high-contrast', 'academia'].includes(saved)) {
        return saved as AppTheme;
      }
      return 'meadow'; // Default is Meadow Sage benchmark
    } catch {
      return 'meadow';
    }
  });

  // 2. UI Density State ('classic' | 'compact' | 'minimal') to prevent user stress with options
  const [uiDensity, setUiDensityState] = useState<UiDensity>(() => {
    try {
      const saved = localStorage.getItem('studymate_ui_density');
      if (saved === 'minimal' || saved === 'compact' || saved === 'classic') return saved;
      return 'classic';
    } catch {
      return 'classic';
    }
  });

  const cycleUiDensity = () => {
    setUiDensityState((prev) => {
      const next = prev === 'classic' ? 'compact' : prev === 'compact' ? 'minimal' : 'classic';
      try {
        localStorage.setItem('studymate_ui_density', next);
      } catch {}
      return next;
    });
  };

  const setUiDensity = (density: UiDensity) => {
    setUiDensityState(density);
    try {
      localStorage.setItem('studymate_ui_density', density);
    } catch {}
  };

  // 2. Language State (English & Simple Malayalam)
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('studymate_app_language');
      if (saved === 'ml' || saved === 'en') return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });

  // 3. Study Trackers (Total study minutes & Streak)
  const [totalStudyMinutes, setTotalStudyMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('studymate_total_study_minutes');
      return saved ? parseInt(saved, 10) : 1725; // 28h 45m initial benchmark from scholar design
    } catch {
      return 1725;
    }
  });

  const [studyStreakDays, setStudyStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('studymate_study_streak_days');
      return saved ? parseInt(saved, 10) : 12; // 12 days streak from scholar design
    } catch {
      return 12;
    }
  });

  // 4. Reading Text Size
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    try {
      const saved = localStorage.getItem('studymate_text_size');
      if (saved === 'normal' || saved === 'large' || saved === 'xlarge') return saved;
      return 'normal';
    } catch {
      return 'normal';
    }
  });

  // 3. ADHD & Dyslexia Accessibility States
  const [dyslexicFont, setDyslexicFontState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymate_dyslexic_font') === 'true';
    } catch {
      return false;
    }
  });

  const [bionicReading, setBionicReadingState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymate_bionic_reading') === 'true';
    } catch {
      return false;
    }
  });

  const [readingRuler, setReadingRulerState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymate_reading_ruler') === 'true';
    } catch {
      return false;
    }
  });

  const [singleChunkFocus, setSingleChunkFocusState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('studymate_single_chunk_focus') === 'true';
    } catch {
      return false;
    }
  });

  const [supportStyle, setSupportStyleState] = useState<SupportStyle>(() => {
    try {
      const saved = localStorage.getItem('studymate_support_style');
      if (saved && ['calm', 'structured', 'gentle', 'reflective', 'direct'].includes(saved)) {
        return saved as SupportStyle;
      }
      return 'calm';
    } catch {
      return 'calm';
    }
  });

  // 4. Memo Halloween Theme State (Witch Hat & Vampire Teeth)
  const [memoHalloweenTheme, setMemoHalloweenThemeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('studymate_memo_halloween');
      if (saved !== null) return saved === 'true';
      return true; // Active by default on Halloween!
    } catch {
      return true;
    }
  });

  // Reading Ruler cursor Y position
  const [rulerTop, setRulerTop] = useState<number>(200);

  // Apply Theme & Dark Classes to document element
  const isDark = theme === 'cosmic' || theme === 'high-contrast';

  useEffect(() => {
    try {
      localStorage.setItem('studymate_theme_v2', theme);
    } catch {}

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isDark]);

  // Apply Dyslexia font class to root body
  useEffect(() => {
    try {
      localStorage.setItem('studymate_dyslexic_font', String(dyslexicFont));
    } catch {}
    if (dyslexicFont) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }
  }, [dyslexicFont]);

  // Track Reading Ruler mouse movement
  useEffect(() => {
    if (!readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setRulerTop(e.clientY - 24);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingRuler]);

  useEffect(() => {
    try {
      localStorage.setItem('studymate_bionic_reading', String(bionicReading));
    } catch {}
  }, [bionicReading]);

  useEffect(() => {
    try {
      localStorage.setItem('studymate_reading_ruler', String(readingRuler));
    } catch {}
  }, [readingRuler]);

  useEffect(() => {
    try {
      localStorage.setItem('studymate_single_chunk_focus', String(singleChunkFocus));
    } catch {}
  }, [singleChunkFocus]);

  useEffect(() => {
    try {
      localStorage.setItem('studymate_support_style', supportStyle);
    } catch {}
  }, [supportStyle]);

  useEffect(() => {
    try {
      localStorage.setItem('studymate_memo_halloween', String(memoHalloweenTheme));
    } catch {}
  }, [memoHalloweenTheme]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ml' : 'en'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('studymate_app_language', language);
    } catch {}
  }, [language]);

  const t = TRANSLATIONS[language];

  const incrementStudyMinutes = (mins = 1) => {
    setTotalStudyMinutes((prev) => {
      const next = prev + mins;
      try {
        localStorage.setItem('studymate_total_study_minutes', String(next));
      } catch {}
      return next;
    });
  };

  // Passive study tracker ticker (adds 1 min every 60s while reading)
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        incrementStudyMinutes(1);
      }
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'meadow') return 'cosmic';
      if (prev === 'cosmic') return 'high-contrast';
      if (prev === 'high-contrast') return 'academia';
      return 'meadow';
    });
  };

  const increaseTextSize = () => {
    setTextSizeState((prev) => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'xlarge';
    });
  };

  const decreaseTextSize = () => {
    setTextSizeState((prev) => {
      if (prev === 'xlarge') return 'large';
      if (prev === 'large') return 'normal';
      return 'normal';
    });
  };

  const fontSizeClass =
    textSize === 'xlarge'
      ? 'text-lg md:text-xl leading-relaxed'
      : textSize === 'large'
      ? 'text-base md:text-lg leading-relaxed'
      : 'text-sm md:text-base leading-normal';

  return (
    <ThemeAndTextContext.Provider
      value={{
        theme,
        setTheme: setThemeState,
        isDark,
        toggleTheme,
        uiDensity,
        setUiDensity,
        cycleUiDensity,
        language,
        setLanguage: setLanguageState,
        toggleLanguage,
        t,
        totalStudyMinutes,
        studyStreakDays,
        incrementStudyMinutes,
        textSize,
        setTextSize: setTextSizeState,
        increaseTextSize,
        decreaseTextSize,
        fontSizeClass,
        dyslexicFont,
        setDyslexicFont: setDyslexicFontState,
        toggleDyslexicFont: () => setDyslexicFontState((p) => !p),
        bionicReading,
        setBionicReading: setBionicReadingState,
        toggleBionicReading: () => setBionicReadingState((p) => !p),
        readingRuler,
        setReadingRuler: setReadingRulerState,
        toggleReadingRuler: () => setReadingRulerState((p) => !p),
        singleChunkFocus,
        setSingleChunkFocus: setSingleChunkFocusState,
        toggleSingleChunkFocus: () => setSingleChunkFocusState((p) => !p),
        supportStyle,
        setSupportStyle: setSupportStyleState,
        memoHalloweenTheme,
        setMemoHalloweenTheme: setMemoHalloweenThemeState,
        toggleMemoHalloweenTheme: () => setMemoHalloweenThemeState((p) => !p),
      }}
    >
      {/* Floating Reading Ruler Overlay when active */}
      {readingRuler && (
        <div
          className="reading-ruler-guide"
          style={{ top: `${rulerTop}px` }}
          aria-hidden="true"
        />
      )}
      {children}
    </ThemeAndTextContext.Provider>
  );
};

export function useThemeAndText() {
  const context = useContext(ThemeAndTextContext);
  if (!context) {
    throw new Error('useThemeAndText must be used within ThemeAndTextProvider');
  }
  return context;
}
