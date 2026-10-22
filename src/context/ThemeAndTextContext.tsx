/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

type TextSize = 'normal' | 'large' | 'xlarge';
type Theme = 'light' | 'dark';

interface ThemeAndTextContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  fontSizeClass: string;
}

const ThemeAndTextContext = createContext<ThemeAndTextContextType | undefined>(undefined);

export const ThemeAndTextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('lfmd_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      // Light theme is the default theme
      return 'light';
    } catch {
      return 'light';
    }
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    try {
      const saved = localStorage.getItem('lfmd_text_size');
      if (saved === 'normal' || saved === 'large' || saved === 'xlarge') return saved;
      return 'normal';
    } catch {
      return 'normal';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lfmd_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('lfmd_text_size', textSize);
    } catch {}
  }, [textSize]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
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
        toggleTheme,
        textSize,
        setTextSize: setTextSizeState,
        increaseTextSize,
        decreaseTextSize,
        fontSizeClass,
      }}
    >
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
