import 'webextension-polyfill';
import {
  vakitlerSettings,
  vakitlerData,
  vakitlerLastUpdate,
} from '../../shared/storages/vakitlerStorage';
import type {
  PrayerTimeData,
  VakitlerSettings,
} from '../../shared/storages/base';

// Constants
const HOUR_FORMAT = 'HH:mm';
const API_DATE_FORMAT = 'dd.MM.yyyy';
const TWO_DAYS_MS = 172800000; // 2 days in milliseconds
const DEBUG_MODE = false; // Production'da false yapın, development'ta true

// Debug log helper - sadece debug mode'da log yapar
const debugLog = (...args: any[]) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

class PrayerTimesManager {
  private times: PrayerTimeData[] = [];
  private settings: VakitlerSettings | null = null;
  private timerInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    try {
      // Load settings and data from storage
      this.settings = await vakitlerSettings.get();
      this.times = await vakitlerData.get();

      // Fetch data if needed
      await this.checkAndFetchData();

      // Start timer updates
      this.startTimer();

      // Force initial badge update
      setTimeout(() => this.updateBadge(), 1000);
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }

  async checkAndFetchData(): Promise<void> {
    if (!this.settings?.city?.IlceID) {
      debugLog('No city configured, skipping data fetch');
      return;
    }

    try {
      const lastUpdate = await vakitlerLastUpdate.get();

      // Check if data is older than 2 days
      if (Date.now() - lastUpdate > TWO_DAYS_MS) {
        debugLog('Prayer data is old, fetching new data...');
        await this.fetchPrayerTimes();
      } else {
        debugLog('Using cached prayer data');
        this.updateBadge();
      }
    } catch (error) {
      console.error('Failed to check data:', error);
    }
  }

  async fetchPrayerTimes(): Promise<void> {
    if (!this.settings?.city?.IlceID) {
      debugLog('No city configured');
      return;
    }

    try {
      const cityID = this.settings.city.IlceID;
      const response = await fetch(
        `https://vakitler.app/api/times?cityID=${cityID}`,
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: PrayerTimeData[] = await response.json();

      // Add yesterday's data
      const yesterday = { ...data[0] };
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);

      yesterday.MiladiTarihKisa = yesterdayDate.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      this.times = [yesterday, ...data];

      // Save to storage
      await vakitlerData.set(this.times);
      await vakitlerLastUpdate.set(Date.now());

      debugLog('Prayer times updated');
      this.updateBadge();
    } catch (error) {
      console.error('Failed to fetch prayer times:', error);
    }
  }

  startTimer(): void {
    // Update every second
    this.timerInterval = setInterval(() => {
      this.updateBadge();
    }, 1000);
  }

  updateBadge(): void {
    debugLog('updateBadge called, times length:', this.times.length);

    if (!this.times.length) {
      debugLog('No times data, setting loading badge');
      chrome.action.setBadgeText({ text: '...' });
      chrome.action.setBadgeBackgroundColor({ color: '#FF9800' });
      return;
    }

    const now = new Date();
    const today = this.getTodayTimes();
    const tomorrow = this.getTomorrowTimes();

    debugLog('Today times:', today ? 'found' : 'not found');
    debugLog('Tomorrow times:', tomorrow ? 'found' : 'not found');

    if (!today || !tomorrow) {
      chrome.action.setBadgeText({ text: '?' });
      chrome.action.setBadgeBackgroundColor({ color: '#F44336' });
      return;
    }

    const remaining = this.calculateRemainingTime(today, tomorrow, now);
    const currentPrayer = this.getCurrentPrayerPeriod(now);

    debugLog('Remaining seconds:', remaining);
    debugLog('Current prayer:', currentPrayer);

    if (remaining !== null && remaining > 0) {
      let badgeText: string;

      // Kullanıcının istediği format kuralları (maksimum karakter uzunluğu gözetilerek)
      const isTurkish =
        this.settings?.language === 'tr' || !this.settings?.language;

      if (remaining >= 3600) {
        // Saatler varsa: s:dk formatı (2:44)
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        badgeText = `${hours}:${minutes.toString().padStart(2, '0')}`;
      } else if (remaining >= 600) {
        // Dakikalar kaldıysa: dk formatı (44dk/44m)
        const minutes = Math.floor(remaining / 60);
        badgeText = isTurkish ? `${minutes}dk` : `${minutes}m `;
      } else if (remaining >= 60) {
        // 10 dakikanın altındaysa: dk:sn formatı (9:32)
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        badgeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      } else {
        // 1 dakikanın altındaysa: sn formatı (15sn/15s)
        const seconds = Math.max(1, remaining); // En az 1 göster
        badgeText = isTurkish ? `${seconds}sn` : `${seconds}s `;
      }

      debugLog('Setting badge text:', badgeText);
      chrome.action.setBadgeText({ text: badgeText });

      // Vakitlere göre renk belirleme
      const badgeColor = this.getBadgeColor(currentPrayer);
      chrome.action.setBadgeBackgroundColor({ color: badgeColor });
    } else {
      debugLog('No remaining time, clearing badge');
      chrome.action.setBadgeText({ text: '' });
    }
  }

  getTodayTimes(): PrayerTimeData | null {
    const today = new Date().toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return this.times.find((t) => t.MiladiTarihKisa === today) || null;
  }

  getTomorrowTimes(): PrayerTimeData | null {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return this.times.find((t) => t.MiladiTarihKisa === tomorrowStr) || null;
  }

  getCurrentPrayerPeriod(now: Date): string {
    const today = this.getTodayTimes();
    if (!today) return 'unknown';

    const prayerTimes = [
      { name: 'Imsak', time: today.Imsak },
      { name: 'Gunes', time: today.Gunes },
      { name: 'Ogle', time: today.Ogle },
      { name: 'Ikindi', time: today.Ikindi },
      { name: 'Aksam', time: today.Aksam },
      { name: 'Yatsi', time: today.Yatsi },
    ];

    // Apply adjustments if they exist
    if (this.settings?.adjustments) {
      prayerTimes.forEach((prayer, index) => {
        if (this.settings!.adjustments[index]) {
          const [hours, minutes] = prayer.time.split(':').map(Number);
          const adjustedMinutes = minutes + this.settings!.adjustments[index];
          const adjustedTime = new Date();
          adjustedTime.setHours(hours, adjustedMinutes, 0, 0);
          prayer.time = adjustedTime.toTimeString().slice(0, 5);
        }
      });
    }

    // Find current prayer period
    for (let i = 0; i < prayerTimes.length; i++) {
      const currentPrayer = prayerTimes[i];
      const nextPrayer = prayerTimes[(i + 1) % prayerTimes.length];

      const currentTime = this.parseTime(currentPrayer.time);
      let nextTime = this.parseTime(nextPrayer.time);

      // Handle Yatsi to Imsak transition (next day)
      if (i === prayerTimes.length - 1) {
        // Yatsi is last
        const tomorrow = this.getTomorrowTimes();
        nextTime = tomorrow ? this.parseTime(tomorrow.Imsak) : nextTime;
        nextTime.setDate(nextTime.getDate() + 1);
      } else {
        nextTime.setHours(nextTime.getHours(), nextTime.getMinutes(), 0, 0);
        nextTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
      }

      // Set current time to today
      currentTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

      if (now >= currentTime && now < nextTime) {
        return currentPrayer.name.toLowerCase();
      }
    }

    return 'unknown';
  }

  getBadgeColor(prayerName: string): string {
    const colorMap: { [key: string]: string } = {
      imsak: '#0ea5e9', // sky-500
      gunes: '#f97316', // orange-500
      ogle: '#eab308', // yellow-500
      ikindi: '#f97316', // orange-500
      aksam: '#3b82f6', // blue-500
      yatsi: '#6366f1', // indigo-500
      unknown: '#4CAF50', // default green
    };

    return colorMap[prayerName] || colorMap['unknown'];
  }

  calculateRemainingTime(
    today: PrayerTimeData,
    tomorrow: PrayerTimeData,
    now: Date,
  ): number | null {
    const prayerTimes = [
      { name: 'Imsak', time: today.Imsak },
      { name: 'Gunes', time: today.Gunes },
      { name: 'Ogle', time: today.Ogle },
      { name: 'Ikindi', time: today.Ikindi },
      { name: 'Aksam', time: today.Aksam },
      { name: 'Yatsi', time: today.Yatsi },
    ];

    // Apply adjustments if they exist
    if (this.settings?.adjustments) {
      prayerTimes.forEach((prayer, index) => {
        if (this.settings!.adjustments[index]) {
          const [hours, minutes] = prayer.time.split(':').map(Number);
          const adjustedMinutes = minutes + this.settings!.adjustments[index];
          const adjustedTime = new Date();
          adjustedTime.setHours(hours, adjustedMinutes, 0, 0);
          prayer.time = adjustedTime.toTimeString().slice(0, 5);
        }
      });
    }

    // Find current prayer period and next prayer time
    for (let i = 0; i < prayerTimes.length; i++) {
      const currentPrayer = prayerTimes[i];
      const nextPrayer = prayerTimes[(i + 1) % prayerTimes.length];

      const currentTime = this.parseTime(currentPrayer.time);
      let nextTime = this.parseTime(nextPrayer.time);

      // Handle Yatsi to Imsak transition (next day)
      if (i === prayerTimes.length - 1) {
        // Yatsi is last
        nextTime = tomorrow ? this.parseTime(tomorrow.Imsak) : nextTime;
        nextTime.setDate(nextTime.getDate() + 1);
      } else {
        nextTime.setHours(nextTime.getHours(), nextTime.getMinutes(), 0, 0);
        nextTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
      }

      // Set current time to today
      currentTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

      if (now >= currentTime && now < nextTime) {
        const diffMs = nextTime.getTime() - now.getTime();
        return Math.floor(diffMs / 1000);
      }
    }

    return null;
  }

  parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // Public method to refresh data
  async refreshData(): Promise<void> {
    await this.fetchPrayerTimes();
  }

  // Public method to update settings
  async updateSettings(newSettings: VakitlerSettings): Promise<void> {
    this.settings = newSettings;
    await vakitlerSettings.set(newSettings);
    await this.checkAndFetchData();
  }

  // Public method to get current settings
  getSettings(): VakitlerSettings | null {
    return this.settings;
  }

  // Public method to get current prayer times
  getTimes(): PrayerTimeData[] {
    return this.times;
  }
}

// Initialize the prayer times manager
const prayerManager = new PrayerTimesManager();

// Export for potential use by popup
(globalThis as any).prayerManager = prayerManager;

// Extension startup - ensure badge is visible
chrome.runtime.onStartup.addListener(() => {
  debugLog('Extension started');
  prayerManager.init();
});

chrome.runtime.onInstalled.addListener(() => {
  debugLog('Extension installed');
  // Set initial badge to show extension is working
  chrome.action.setBadgeText({ text: '...' });
  chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
  prayerManager.init();
});

// Listen for storage changes from popup
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.VAKITLER_SETTINGS || changes.VAKITLER_DATA) {
      debugLog('Storage changed, updating badge');
      prayerManager.init();
    }
  }
});

// Message handling for future extensions
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) =>
    // Handle other message types here if needed
    true,
);

// Test function for badge text formats
function testBadgeTextFormats(): void {
  console.log('=== Badge Text Format Test ===');

  // Test cases for different remaining times
  const testCases = [
    { remaining: 7200, expected: '2:00' }, // 2 hours
    { remaining: 3660, expected: '1:01' }, // 1 hour 1 minute
    { remaining: 1800, expected: '30dk' }, // 30 minutes (Turkish)
    { remaining: 600, expected: '10dk' }, // 10 minutes
    { remaining: 599, expected: '9:59' }, // 9 minutes 59 seconds
    { remaining: 60, expected: '1:00' }, // 1 minute
    { remaining: 59, expected: '59sn' }, // 59 seconds
    { remaining: 1, expected: '1sn' }, // 1 second
  ];

  // Test Turkish format
  console.log('Turkish format test:');
  const isTurkish = true;
  testCases.forEach(({ remaining, expected }) => {
    let result = '';
    if (remaining >= 3600) {
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      result = `${hours}:${minutes.toString().padStart(2, '0')}`;
    } else if (remaining >= 600) {
      const minutes = Math.floor(remaining / 60);
      result = isTurkish ? `${minutes}dk` : `${minutes}m `;
    } else if (remaining >= 60) {
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      result = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      const seconds = Math.max(1, remaining);
      result = isTurkish ? `${seconds}sn` : `${seconds}s `;
    }
    console.log(`  ${remaining}s -> "${result}" (expected: "${expected}")`);
  });

  // Test English format
  console.log('English format test:');
  const isEnglish = false;
  testCases.forEach(({ remaining }) => {
    let result = '';
    if (remaining >= 3600) {
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      result = `${hours}:${minutes.toString().padStart(2, '0')}`;
    } else if (remaining >= 600) {
      const minutes = Math.floor(remaining / 60);
      result = isEnglish ? `${minutes}m ` : `${minutes}dk`;
    } else if (remaining >= 60) {
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      result = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      const seconds = Math.max(1, remaining);
      result = isEnglish ? `${seconds}s ` : `${seconds}sn`;
    }
    console.log(`  ${remaining}s -> "${result}"`);
  });
}

// Run test in development mode
if (DEBUG_MODE && process.env.NODE_ENV === 'development') {
  testBadgeTextFormats();
}

debugLog('Background loaded');
debugLog("Edit 'src/pages/background/index.ts' and save to reload.");
