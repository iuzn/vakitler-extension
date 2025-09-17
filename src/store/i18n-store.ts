/**
 * Vakitler Extension - i18n Zustand Store
 * Centralized, type-safe i18n state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Language, TranslationKey, translations } from '../lib/translations';

interface I18nState {
  // Current language
  language: Language;

  // Translation cache for performance
  translations: Record<TranslationKey, string>;

  // Actions
  setLanguage: (language: Language) => void;
  translate: (key: TranslationKey) => string;
  detectLanguage: () => Language;
  initialize: () => void;
}

const STORAGE_KEY = 'vakitler-i18n';

// Advanced language detection with multiple fallbacks
const detectUserLanguage = (): Language => {
  // 1. Check localStorage first (user preference)
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'tr' || stored === 'en') {
    return stored;
  }

  // 2. Try navigator.languages (most reliable for user preference)
  if (typeof navigator !== 'undefined' && navigator.languages?.length > 0) {
    for (const lang of navigator.languages) {
      const langLower = lang.toLowerCase();
      if (langLower.startsWith('tr')) return 'tr';
      if (langLower.startsWith('en')) return 'en';
    }
  }

  // 3. Try Chrome i18n API
  if (typeof chrome !== 'undefined' && chrome.i18n) {
    try {
      const uiLanguage = chrome.i18n.getUILanguage();
      if (uiLanguage.startsWith('tr')) return 'tr';
      if (uiLanguage.startsWith('en')) return 'en';
    } catch (error) {
      console.warn('Chrome i18n detection failed:', error);
    }
  }

  // 4. Try navigator.language as fallback
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('tr')) return 'tr';
    if (browserLang.startsWith('en')) return 'en';
  }

  // 5. Try to detect Turkish location/timezone
  if (typeof Intl !== 'undefined') {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone.includes('Turkey') || timeZone.includes('Istanbul')) {
        return 'tr';
      }
    } catch (error) {
      console.warn('Timezone detection failed:', error);
    }
  }

  // 6. Default to English for international users
  return 'en';
};

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en', // Will be set during initialization
      translations: translations.en, // Default to English

      setLanguage: (language: Language) => {
        console.log('Setting language to:', language);

        // Update language
        set({ language });

        // Update translations cache
        set({ translations: translations[language] });

        // Update document language attribute
        if (typeof document !== 'undefined') {
          document.documentElement.lang = language;
        }

        // Update localStorage for backward compatibility
        localStorage.setItem(STORAGE_KEY, language);
        localStorage.setItem('vakitler-language', language);

        console.log('Language updated successfully');
      },

      translate: (key: TranslationKey): string => {
        const { translations: currentTranslations } = get();
        return currentTranslations[key] || key;
      },

      detectLanguage: (): Language => {
        return detectUserLanguage();
      },

      initialize: () => {
        const detectedLanguage = detectUserLanguage();
        console.log(
          'Initializing i18n with detected language:',
          detectedLanguage,
        );

        // Set detected language and update translations
        set({
          language: detectedLanguage,
          translations: translations[detectedLanguage],
        });

        // Update document
        if (typeof document !== 'undefined') {
          document.documentElement.lang = detectedLanguage;
        }

        // Ensure localStorage is updated
        localStorage.setItem(STORAGE_KEY, detectedLanguage);
        localStorage.setItem('vakitler-language', detectedLanguage);

        console.log('i18n initialization completed');
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist the language, not the translations (they're derived)
      partialize: (state) => ({ language: state.language }),
      // On rehydration, update translations based on persisted language
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Rehydrating i18n state:', state.language);
          state.translations = translations[state.language];
        }
      },
    },
  ),
);

// Prayer time names mapping for backward compatibility
export const getPrayerTimeName = (timeName: string): string => {
  const { translate } = useI18nStore.getState();

  const prayerTimeMap: Record<string, TranslationKey> = {
    Imsak: 'fajr',
    Gunes: 'sunrise',
    Ogle: 'dhuhr',
    Ikindi: 'asr',
    Aksam: 'maghrib',
    Yatsi: 'isha',
  };

  const key = prayerTimeMap[timeName];
  return key ? translate(key) : timeName;
};

// Prayer time name with emoji (Friday prayer special handling)
export const getPrayerTimeNameWithEmoji = (timeName: string): string => {
  const name = getPrayerTimeName(timeName);

  // Add special emoji for Friday prayer
  if (timeName === 'Ogle' && new Date().getDay() === 5) {
    return `${name} 🕌`;
  }

  return name;
};
