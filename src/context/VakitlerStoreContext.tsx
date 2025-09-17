import { createContext, ReactNode, useEffect, useState } from 'react';
import { Times } from '../models/times';
import { IVakitlerStore, TypeTimer, IRelease, ITime } from '../types/common';
import { TimeFormat } from '../shared/storages/base';
import {
  vakitlerSettings,
  vakitlerData,
  vakitlerLastUpdate,
} from '../shared/storages/vakitlerStorage';
import { useInterval } from '../hooks/useInterval';
import { useI18nStore } from '../store/i18n-store';

export const VakitlerStoreContext = createContext<
  IVakitlerStore & { isLoading: boolean; error: string | null }
>({
  settings: {
    country: undefined,
    _country: undefined,
    region: undefined,
    _region: undefined,
    city: undefined,
    _city: undefined,
    timeFormat: TimeFormat.TwentyFour,
    adjustments: [0, 0, 0, 0, 0, 0],
    islamicDate: false,
    ramadanTimer: false,
    language: undefined, // Will be set to user's system language
  },
  setSettings: () => {},
  fetchData: () => Promise.resolve(),
  rawTimes: undefined,
  times: undefined,
  timer: [0, 0, 0],
  timerRamadan: [0, 0, 0],
  releases: [],
  saveSettings: () => {},
  isLoading: true,
  error: null,
});

export function VakitlerStoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<IVakitlerStore['settings']>({
    timeFormat: TimeFormat.TwentyFour,
    adjustments: [0, 0, 0, 0, 0, 0],
    islamicDate: false,
    ramadanTimer: false,
    language: undefined, // Will be set to user's system language
  });

  const [releases, setReleases] = useState<IVakitlerStore['releases']>([]);
  const [times, setTimes] = useState<IVakitlerStore['times']>();
  const [rawTimes, setRawTimes] = useState<IVakitlerStore['rawTimes']>();
  const [timer, setTimer] = useState<TypeTimer>([0, 0, 0]);
  const [timerRamadan, setTimerRamadan] = useState<TypeTimer>([0, 0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (cityID: string) => {
    if (!cityID) {
      console.error('cityID is required');
      return;
    }

    console.log('Fetching data for cityID:', cityID);
    setIsLoading(true);

    try {
      const url = `https://vakitler.app/api/times?cityID=${cityID}`;
      console.log('API URL:', url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('API Response data length:', data.length);

      if (!data || data.length === 0) {
        throw new Error('No data received from API');
      }

      // Add yesterday's data
      const yesterday = { ...data[0] };
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      yesterday.MiladiTarihKisa = yesterdayDate.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const allData = [yesterday, ...data];
      console.log('Total data length after adding yesterday:', allData.length);

      await vakitlerData.set(allData);
      await vakitlerLastUpdate.set(Date.now());

      // Get current settings for adjustments
      const currentSettings = await vakitlerSettings.get();
      const adjustments = currentSettings?.adjustments || [0, 0, 0, 0, 0, 0];

      setTimes(new Times(allData, adjustments));
      setRawTimes(new Times(allData));

      console.log('Data successfully loaded and saved');
    } catch (e) {
      console.error('Failed to fetch prayer times:', e);
      const errorMessage =
        e instanceof Error ? e.message : 'Unknown error occurred';
      setError(errorMessage);
      // Re-throw error to handle in calling function
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const initApp = async () => {
    try {
      console.log('Initializing app...');
      setIsLoading(true);
      setError(null); // Clear any previous errors

      // Load settings and data from storage
      const storedSettings = await vakitlerSettings.get();
      console.log('Loaded settings:', storedSettings);

      const storedData = await vakitlerData.get();
      console.log('Loaded data length:', storedData?.length || 0);

      if (storedSettings) {
        // Ensure language is set, default to user's system language if not present
        const userLanguage =
          storedSettings.language ||
          (localStorage.getItem('vakitler-language') as 'tr' | 'en') ||
          'tr'; // Default to Turkish for Turkey-based users

        const settingsWithLanguage = {
          ...storedSettings,
          language: userLanguage,
        };
        setSettingsState(settingsWithLanguage);

        // Sync with i18n store
        useI18nStore.getState().setLanguage(userLanguage);

        console.log(
          'Settings applied successfully with language:',
          settingsWithLanguage.language,
        );
      } else {
        // No stored settings, detect user's system language
        let userLanguage: 'tr' | 'en' = 'tr'; // Default to Turkish

        // Try to detect user's language
        if (typeof navigator !== 'undefined') {
          if (navigator.languages?.length > 0) {
            for (const lang of navigator.languages) {
              if (lang.toLowerCase().startsWith('tr')) {
                userLanguage = 'tr';
                break;
              } else if (lang.toLowerCase().startsWith('en')) {
                userLanguage = 'en';
                break;
              }
            }
          } else if (navigator.language?.toLowerCase().startsWith('tr')) {
            userLanguage = 'tr';
          }
        }

        // Check if we're in Turkey timezone
        if (typeof Intl !== 'undefined') {
          try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timeZone.includes('Turkey') || timeZone.includes('Istanbul')) {
              userLanguage = 'tr';
            }
          } catch (e) {
            // Ignore timezone detection errors
          }
        }

        const defaultSettingsWithLanguage = {
          timeFormat: TimeFormat.TwentyFour,
          adjustments: [0, 0, 0, 0, 0, 0],
          islamicDate: false,
          ramadanTimer: false,
          language: userLanguage,
        };
        setSettingsState(defaultSettingsWithLanguage);

        // Sync with i18n store
        useI18nStore.getState().setLanguage(userLanguage);

        console.log(
          'Using default settings with detected language:',
          defaultSettingsWithLanguage.language,
        );
      }

      if (storedData && storedData.length > 0) {
        const adjustments = storedSettings?.adjustments || [0, 0, 0, 0, 0, 0];
        console.log('Using adjustments:', adjustments);

        const timesInstance = new Times(storedData, adjustments);
        setTimes(timesInstance);
        setRawTimes(new Times(storedData)); // Raw data without adjustments
        console.log('Prayer times loaded successfully');
      } else {
        // If no city is selected, show empty state
        if (!storedSettings?.city?.IlceID) {
          console.log('No city selected, waiting for user input');
        } else {
          console.log('City selected but no data found, will fetch data');
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to initialize app';
      setError(errorMessage);
      // Reset to safe defaults on error
      setSettingsState({
        adjustments: [0, 0, 0, 0, 0, 0],
        timeFormat: TimeFormat.TwentyFour,
        islamicDate: false,
        ramadanTimer: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = (newSettings: IVakitlerStore['settings']) => {
    vakitlerSettings.set(newSettings);
  };

  const setSettings = (value: IVakitlerStore['settings']) => {
    // Check if language has changed
    const currentLanguage = localStorage.getItem('vakitler-language');
    const newLanguage = value.language;

    if (newLanguage && newLanguage !== currentLanguage) {
      console.log('Language changed from', currentLanguage, 'to', newLanguage);
      // Update language via Zustand store
      useI18nStore.getState().setLanguage(newLanguage as 'tr' | 'en');
    }

    setSettingsState(value);
    saveSettings(value);

    // If adjustments changed and we have times data, update them
    if (times && value.adjustments) {
      console.log('Adjustments changed, updating times:', value.adjustments);
      times.updateAdjustments(value.adjustments);
      // Force re-render by updating state
      setTimes(
        new Times(
          times.rawTimes.map((t) => t as ITime),
          value.adjustments,
        ),
      );
    }
  };

  const updateTimer = () => {
    if (!times) return;
    setTimer(times.timer());
    setTimerRamadan(times.timerRamadan());
  };

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    if (!times) return;
    updateTimer();
  }, [times]);

  useInterval(
    () => {
      if (!times) return;

      const localTime = new Date();
      const timeTravel = times.timeTravel ?? [0, 0, 0];
      const hasChange = timeTravel.some((value: number) => value !== 0);

      if (hasChange) {
        localTime.setHours(
          localTime.getHours() + timeTravel[0],
          localTime.getMinutes() + timeTravel[1],
          localTime.getSeconds() + timeTravel[2],
        );
      }

      times.updateDateTime(localTime);
      updateTimer();
    },
    times ? 1000 : null,
  );

  return (
    <VakitlerStoreContext.Provider
      value={{
        settings,
        setSettings,
        fetchData,
        rawTimes,
        times,
        timer,
        timerRamadan,
        releases,
        saveSettings,
        isLoading,
        error,
      }}
    >
      {children}
    </VakitlerStoreContext.Provider>
  );
}
