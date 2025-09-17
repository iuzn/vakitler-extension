/**
 * Vakitler Extension - i18n Context Provider
 * Provides i18n context to the entire application
 */

import React, { createContext, useContext, useEffect } from 'react';
import { useI18nStore } from '../store/i18n-store';
import { Language, TranslationKey } from '../lib/translations';

interface I18nContextType {
  // Current language
  currentLanguage: Language;

  // Translation function
  t: (key: TranslationKey) => string;

  // Language management
  changeLanguage: (language: Language) => void;
  isTurkish: () => boolean;
  isEnglish: () => boolean;

  // Initialization
  initialize: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { language, translate, setLanguage, initialize } = useI18nStore();

  // Initialize i18n on mount
  useEffect(() => {
    console.log('I18nProvider: Initializing i18n system');
    initialize();
  }, [initialize]);

  const value: I18nContextType = {
    currentLanguage: language,
    t: translate,
    changeLanguage: setLanguage,
    isTurkish: () => language === 'tr',
    isEnglish: () => language === 'en',
    initialize,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

// Hook to use i18n context
export const useI18nContext = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
};

// Backward compatibility hook
export const useTranslation = () => {
  const { t, currentLanguage, changeLanguage } = useI18nContext();

  return {
    t,
    language: currentLanguage,
    changeLanguage,
    currentLanguage,
  };
};
