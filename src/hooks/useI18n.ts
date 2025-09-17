/**
 * Vakitler Extension - i18n React Hooks
 * Easy-to-use hooks for internationalization
 */

import React, { useCallback } from 'react';
import { useI18nStore } from '../store/i18n-store';
import { TranslationKey, Language } from '../lib/translations';
import { ReactNode } from 'react';

// Main i18n hook
export const useI18n = () => {
  const { language, translate, setLanguage, initialize, detectLanguage } =
    useI18nStore();

  // Type-safe translation function
  const t = useCallback(
    (key: TranslationKey): string => {
      return translate(key);
    },
    [translate],
  );

  // Translation function with interpolation support
  const tWithComponents = useCallback(
    (key: TranslationKey, components?: ReactNode[]): ReactNode => {
      const text = translate(key);

      if (!components || components.length === 0) {
        return text;
      }

      // Simple approach: replace tags with HTML and use dangerouslySetInnerHTML
      let htmlText = text;
      components.forEach((component, index) => {
        if (component && React.isValidElement(component)) {
          const tagName = component.type === 'b' ? 'b' : 'span';
          const style = component.type === 'b' ? 'font-weight: bold;' : '';
          htmlText = htmlText.replace(
            new RegExp(`<${index}>(.*?)</${index}>`, 'g'),
            `<${tagName} style="${style}">$1</${tagName}>`,
          );
        }
      });

      // Return as span with dangerouslySetInnerHTML
      return React.createElement('span', {
        key: `trans-${key}`,
        dangerouslySetInnerHTML: { __html: htmlText },
      });
    },
    [translate],
  );

  // Change language
  const changeLanguage = useCallback(
    (newLanguage: Language) => {
      setLanguage(newLanguage);
    },
    [setLanguage],
  );

  // Get current language
  const getCurrentLanguage = useCallback((): Language => {
    return language;
  }, [language]);

  // Check if current language is Turkish
  const isTurkish = useCallback((): boolean => {
    return language === 'tr';
  }, [language]);

  // Check if current language is English
  const isEnglish = useCallback((): boolean => {
    return language === 'en';
  }, [language]);

  // HTML tag'lerini parse eden renderer (<0>text</0> -> <b>text</b>)
  const tHtml = useCallback(
    (key: TranslationKey): ReactNode => {
      const text = translate(key);

      // HTML tag'lerini React element'lerine dönüştür
      if (text.includes('<0>') && text.includes('</0>')) {
        const parts = text.split(/(<0>|<\/0>)/);
        const elements: ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (part === '<0>') {
            // Sonraki parçayı kalın yap
            const nextPart = parts[i + 1];
            if (nextPart && nextPart !== '</0>') {
              elements.push(
                React.createElement(
                  'strong',
                  {
                    key: `bold-${i}`,
                    className: 'font-bold',
                  },
                  nextPart,
                ),
              );
              i++; // </0> tag'ini atla
            }
          } else if (part !== '</0>') {
            // Normal metin
            elements.push(part);
          }
        }

        return React.createElement('span', { key: `html-${key}` }, elements);
      }

      return text;
    },
    [translate],
  );

  return {
    t,
    tc: tWithComponents, // translate with components (interpolation)
    th: tHtml, // translate with html rendering
    changeLanguage,
    getCurrentLanguage,
    isTurkish,
    isEnglish,
    initialize,
    detectLanguage,
    currentLanguage: language,
  };
};

// Specialized hook for prayer times
export const usePrayerTimeNames = () => {
  const { t } = useI18n();

  const getPrayerTimeName = useCallback(
    (timeName: string): string => {
      const prayerTimeMap: Record<string, TranslationKey> = {
        Imsak: 'fajr',
        Gunes: 'sunrise',
        Ogle: 'dhuhr',
        Ikindi: 'asr',
        Aksam: 'maghrib',
        Yatsi: 'isha',
      };

      const key = prayerTimeMap[timeName];
      return key ? t(key) : timeName;
    },
    [t],
  );

  const getPrayerTimeNameWithEmoji = useCallback(
    (timeName: string): string => {
      const name = getPrayerTimeName(timeName);

      // Add special emoji for Friday prayer
      if (timeName === 'Ogle' && new Date().getDay() === 5) {
        return `${name} 🕌`;
      }

      return name;
    },
    [getPrayerTimeName],
  );

  return {
    getPrayerTimeName,
    getPrayerTimeNameWithEmoji,
  };
};

// Hook for settings options
export const useSettingsOptions = () => {
  const { t } = useI18n();

  const languageOptions = [
    { value: 'tr' as Language, label: t('langOptionTr') },
    { value: 'en' as Language, label: t('langOptionEn') },
  ];

  const themeOptions = [
    { value: 'system', label: t('themeOptionSystem') },
    { value: 'light', label: t('themeOptionLight') },
    { value: 'dark', label: t('themeOptionDark') },
  ];

  const timeFormatOptions = [
    { value: '12', label: t('timeFormatOption12') },
    { value: '24', label: t('timeFormatOption24') },
  ];

  return {
    languageOptions,
    themeOptions,
    timeFormatOptions,
  };
};

// Hook for initialization (use once at app startup)
export const useI18nInit = () => {
  const { initialize } = useI18nStore();

  return { initialize };
};
