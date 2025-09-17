/**
 * Vakitler Extension - Type-Safe Translation System
 * All translations with full TypeScript support
 */

export type Language = 'tr' | 'en';

export type TranslationKey =
  // Navigation
  | 'settings'
  | 'back'
  | 'backButton'
  | 'save'
  | 'cancel'
  | 'close'

  // Prayer Times
  | 'prayerTimes'
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha'
  | 'Imsak'
  | 'Gunes'
  | 'Ogle'
  | 'Ikindi'
  | 'Aksam'
  | 'Yatsi'
  | 'nextPrayer'
  | 'remainingTime'

  // Location
  | 'location'
  | 'selectLocation'
  | 'selectCountry'
  | 'selectRegion'
  | 'selectDistrict'
  | 'selectCity'

  // Language & Theme
  | 'language'
  | 'themeTitle'
  | 'theme'
  | 'langOptionTr'
  | 'langOptionEn'
  | 'themeOptionSystem'
  | 'themeOptionLight'
  | 'themeOptionDark'

  // Time
  | 'timeFormatTitle'
  | 'timeFormat'
  | 'timeFormatOption12'
  | 'timeFormatOption24'
  | 'iftarTime'
  | 'timerHour'
  | 'timerMinute'
  | 'timerSecond'
  | 'hourShort'
  | 'minuteShort'
  | 'hour'
  | 'minute'
  | 'second'

  // Settings
  | 'islamicDate'
  | 'ramadanTimer'
  | 'customAdjustmentsTitle'
  | 'customAdjustmentsEmpty'
  | 'adjustmentsDescription'
  | 'adjustments:description'
  | 'adjustmentsTitle'
  | 'resetAdjustments'
  | 'originalTime'
  | 'adjustedTime'

  // About
  | 'about'
  | 'aboutTitle'
  | 'aboutOpenSource'
  | 'aboutAPI'
  | 'support'
  | 'openSourceProject'
  | 'thisExtension'
  | 'extensionInfo'

  // Status
  | 'loading'
  | 'prayerTimesLoading'
  | 'error'
  | 'retry'

  // Search
  | 'search'
  | 'searchCountry'
  | 'searchRegion'
  | 'searchDistrict'

  // Additional keys
  | 'viewTimes'
  | 'timesNotFound'
  | 'jumuah'
  | 'timeTo';

// Translation dictionaries
export const translations: Record<Language, Record<TranslationKey, string>> = {
  tr: {
    // Navigation
    settings: 'Ayarlar',
    back: 'Geri',
    backButton: 'Geri',
    save: 'Kaydet',
    cancel: 'İptal',
    close: 'Kapat',

    // Prayer Times
    prayerTimes: 'Namaz Vakitleri',
    fajr: 'İmsak',
    sunrise: 'Güneş',
    dhuhr: 'Öğle',
    asr: 'İkindi',
    maghrib: 'Akşam',
    isha: 'Yatsı',
    Imsak: 'İmsak',
    Gunes: 'Güneş',
    Ogle: 'Öğle',
    Ikindi: 'İkindi',
    Aksam: 'Akşam',
    Yatsi: 'Yatsı',
    nextPrayer: 'Sonraki Vakit',
    remainingTime: 'vaktine',

    // Location
    location: 'Konum',
    selectLocation: 'Konum Seçin',
    selectCountry: 'Ülke Seçin',
    selectRegion: 'İl Seçin',
    selectDistrict: 'İlçe Seçin',
    selectCity: 'Şehir Seçin',

    // Language & Theme
    language: 'Dil',
    themeTitle: 'Görünüş',
    theme: 'Tema',
    langOptionTr: 'Türkçe',
    langOptionEn: 'English',
    themeOptionSystem: 'Sistem',
    themeOptionLight: 'Açık',
    themeOptionDark: 'Koyu',

    // Time
    timeFormatTitle: 'Saat formatı',
    timeFormat: 'Saat Formatı',
    timeFormatOption12: '12 Saat',
    timeFormatOption24: '24 Saat',
    iftarTime: 'İftar vaktine:',
    timerHour: '$1 sa',
    timerMinute: '$1 dk',
    timerSecond: '$1 sn',
    hourShort: 'sa',
    minuteShort: 'dk',
    hour: 'sa',
    minute: 'dk',
    second: 'sn',

    // Settings
    islamicDate: 'Hicri Tarih',
    ramadanTimer: 'İftar Sayacı',
    customAdjustmentsTitle: 'Dakika Ayarları',
    customAdjustmentsEmpty: 'Ayarlanmamış',
    adjustmentsDescription:
      'Kişisel tercihleriniz ya da yerel farklılıklar için namaz saatlerine ince ayar yapın.',
    'adjustments:description':
      'Kişisel tercihleriniz ya da yerel farklılıklar için namaz saatlerine ince ayar yapın.',
    adjustmentsTitle: 'Özel Dakika Ayarı',
    resetAdjustments: 'Tümünü Sıfırla',
    originalTime: 'Orijinal',
    adjustedTime: 'Ayarlanmış',

    // About
    about: 'Hakkında',
    aboutTitle: 'Uygulama hakkında',
    aboutOpenSource: 'Bu proje ücretsiz ve açık kaynaktır',
    aboutAPI:
      "Bu proje <0>Türkiye Diyanet İşleri Başkanlığı</0>'nın verileri kullanılarak geliştirilmiştir.",
    support: 'Desteğiniz için teşekkür ederim',
    openSourceProject: 'Web Projesi',
    thisExtension: 'Bu Uzantı',
    extensionInfo:
      "Bu eklenti, <0>Adem İlter</0>'in açık kaynaklı vakitler projesinden yola çıkılarak geliştirilmiştir.",

    // Status
    loading: 'Yükleniyor...',
    prayerTimesLoading: 'Namaz vakitleri yükleniyor...',
    error: 'Hata',
    retry: 'Tekrar Dene',

    // Search
    search: 'Ara...',
    searchCountry: 'Ülke ara...',
    searchRegion: 'İl ara...',
    searchDistrict: 'İlçe ara...',

    // Additional keys
    viewTimes: 'Zamanları Görüntüle',
    timesNotFound: 'Zamanlar bulunamadı',
    jumuah: 'Cuma',
    timeTo: 'Kalan Süre',
  },

  en: {
    // Navigation
    settings: 'Settings',
    back: 'Back',
    backButton: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',

    // Prayer Times
    prayerTimes: 'Prayer Times',
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    Imsak: 'Fajr',
    Gunes: 'Sunrise',
    Ogle: 'Dhuhr',
    Ikindi: 'Asr',
    Aksam: 'Maghrib',
    Yatsi: 'Isha',
    nextPrayer: 'Next Prayer',
    remainingTime: 'Time to',

    // Location
    location: 'Location',
    selectLocation: 'Select Location',
    selectCountry: 'Select Country',
    selectRegion: 'Select Region',
    selectDistrict: 'Select District',
    selectCity: 'Select City',

    // Language & Theme
    language: 'Language',
    themeTitle: 'Appearance',
    theme: 'Theme',
    langOptionTr: 'Türkçe',
    langOptionEn: 'English',
    themeOptionSystem: 'System',
    themeOptionLight: 'Light',
    themeOptionDark: 'Dark',

    // Time
    timeFormatTitle: 'Time format',
    timeFormat: 'Time Format',
    timeFormatOption12: '12 Hour',
    timeFormatOption24: '24 Hour',
    iftarTime: 'Iftar Time:',
    timerHour: '$1 h',
    timerMinute: '$1 m',
    timerSecond: '$1 s',
    hourShort: 'h',
    minuteShort: 'm',
    hour: 'h',
    minute: 'm',
    second: 's',

    // Settings
    islamicDate: 'Islamic Date',
    ramadanTimer: 'Ramadan Timer',
    customAdjustmentsTitle: 'Minute Adjustments',
    customAdjustmentsEmpty: 'No adjustments',
    adjustmentsDescription:
      'Make fine adjustments to prayer times for your personal preferences or local differences.',
    'adjustments:description':
      'Make fine adjustments to prayer times for your personal preferences or local differences.',
    adjustmentsTitle: 'Custom Minute Adjustments',
    resetAdjustments: 'Reset All',
    originalTime: 'Original',
    adjustedTime: 'Adjusted',

    // About
    about: 'About',
    aboutTitle: 'About the project',
    aboutOpenSource: 'This project is free and open source',
    aboutAPI:
      'This project was developed using data from the <0>Presidency of Religious Affairs of Turkey</0>.',
    support: 'Thanks for your support',
    openSourceProject: 'Web Project',
    thisExtension: 'This Extension',
    extensionInfo:
      "This extension was developed based on <0>Adem Ilter</0>'s open source prayer times project.",

    // Status
    loading: 'Loading...',
    prayerTimesLoading: 'Loading prayer times...',
    error: 'Error',
    retry: 'Retry',

    // Search
    search: 'Search...',
    searchCountry: 'Search country...',
    searchRegion: 'Search region...',
    searchDistrict: 'Search district...',

    // Additional keys
    viewTimes: 'View Times',
    timesNotFound: 'Times not found',
    jumuah: 'Friday',
    timeTo: 'Time To',
  },
};
