import { useContext, useState, useEffect, useMemo } from 'react';
import { VakitlerStoreContext } from '../../context/VakitlerStoreContext';
import { useI18nContext } from '../../context/I18nProvider';
import { ICountry, IRegion, ICity } from '../../types/common';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import Fuse from 'fuse.js';

interface CitySelectionProps {
  onComplete?: () => void;
  showCloseButton?: boolean;
}

export default function CitySelection({
  onComplete,
  showCloseButton,
}: CitySelectionProps) {
  const { settings, setSettings, fetchData } = useContext(VakitlerStoreContext);
  const { t } = useI18nContext();
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'country' | 'region' | 'city'>('country');
  const [searchQuery, setSearchQuery] = useState('');

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Gelişmiş Fuse.js konfigürasyonu - Türkçe karakterler ve semantik arama için optimize edildi
  const countryFuse = useMemo(
    () =>
      new Fuse(countries, {
        keys: ['UlkeAdi', 'UlkeAdiEn'] as any,
        threshold: 0.4, // Daha esnek eşleştirme için artırıldı
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 1, // Tek karakter aramaları için
        ignoreLocation: true, // Pozisyon önemli değil
        getFn: (obj, path) => {
          // Türkçe karakterleri normalize et
          const value = obj[path as keyof typeof obj];
          if (typeof value === 'string') {
            return value
              .toLowerCase()
              .replace(/ğ/g, 'g')
              .replace(/ü/g, 'u')
              .replace(/ş/g, 's')
              .replace(/ı/g, 'i')
              .replace(/ö/g, 'o')
              .replace(/ç/g, 'c');
          }
          return value;
        },
      }),
    [countries],
  );

  const regionFuse = useMemo(
    () =>
      new Fuse(regions, {
        keys: ['SehirAdi', 'SehirAdiEn'] as any,
        threshold: 0.4,
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 1,
        ignoreLocation: true,
        getFn: (obj, path) => {
          const value = obj[path as keyof typeof obj];
          if (typeof value === 'string') {
            return value
              .toLowerCase()
              .replace(/ğ/g, 'g')
              .replace(/ü/g, 'u')
              .replace(/ş/g, 's')
              .replace(/ı/g, 'i')
              .replace(/ö/g, 'o')
              .replace(/ç/g, 'c');
          }
          return value;
        },
      }),
    [regions],
  );

  const cityFuse = useMemo(
    () =>
      new Fuse(cities, {
        keys: ['IlceAdi', 'IlceAdiEn'] as any,
        threshold: 0.4,
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 1,
        ignoreLocation: true,
        getFn: (obj, path) => {
          const value = obj[path as keyof typeof obj];
          if (typeof value === 'string') {
            return value
              .toLowerCase()
              .replace(/ğ/g, 'g')
              .replace(/ü/g, 'u')
              .replace(/ş/g, 's')
              .replace(/ı/g, 'i')
              .replace(/ö/g, 'o')
              .replace(/ç/g, 'c');
          }
          return value;
        },
      }),
    [cities],
  );

  // Reset search when step changes
  useEffect(() => {
    setSearchQuery('');
  }, [step]);

  // Popular country IDs (same as web application)
  const popularCountryIds = [
    '2',
    '13',
    '33',
    '4',
    '39',
    '15',
    '11',
    '36',
    '52',
  ];

  // Popular region IDs for specific countries (same as web application)
  const getPopularRegionIds = (countryId: string) => {
    // Turkey regions - Push Istanbul and Ankara first
    if (countryId === '2') {
      return ['539', '506']; // Istanbul, Ankara
    }
    return [];
  };

  // Türkçe karakterleri normalize eden yardımcı fonksiyon
  const normalizeTurkish = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');
  };

  // Gelişmiş filtreleme - Fuse.js fuzzy search ile semantik arama
  const getFilteredData = () => {
    if (!searchQuery.trim()) {
      switch (step) {
        case 'country':
          // Popüler ülkeleri önce göster, web uygulaması ile aynı
          const popularCountries = popularCountryIds
            .map((id) => countries.find((c) => c.UlkeID === id))
            .filter((c) => c) as ICountry[];
          const otherCountries = countries.filter(
            (c) => !popularCountries.find((pc) => pc.UlkeID === c.UlkeID),
          );
          return [...popularCountries, ...otherCountries];
        case 'region':
          // Belirli ülkeler için popüler şehirleri önce göster
          const popularRegionIds = getPopularRegionIds(
            settings?.country?.UlkeID || '',
          );
          const popularRegions = popularRegionIds
            .map((id) => regions.find((r) => r.SehirID === id))
            .filter((r) => r) as IRegion[];
          const otherRegions = regions.filter(
            (r) => !popularRegions.find((pr) => pr.SehirID === r.SehirID),
          );
          return [...popularRegions, ...otherRegions];
        case 'city':
          return cities;
        default:
          return [];
      }
    }

    // Arama sorgusunu normalize et - Türkçe karakterleri de dahil et
    const query = normalizeSearch(searchQuery.trim());

    switch (step) {
      case 'country':
        return countryFuse
          .search(query)
          .filter((result) => (result.score || 0) < 0.6) // Daha esnek eşleştirme
          .map((result) => result.item);
      case 'region':
        return regionFuse
          .search(query)
          .filter((result) => (result.score || 0) < 0.6)
          .map((result) => result.item);
      case 'city':
        return cityFuse
          .search(query)
          .filter((result) => (result.score || 0) < 0.6)
          .map((result) => result.item);
      default:
        return [];
    }
  };

  // Akıllı arama normalizasyonu - hem normal hem normalize edilmiş versiyonu ara
  const normalizeSearch = (query: string): string => {
    const normalizedQuery = normalizeTurkish(query);
    // Orijinal sorgu ile normalize edilmiş sorguyu birleştir
    return query !== normalizedQuery ? `${query} ${normalizedQuery}` : query;
  };

  const loadCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://vakitler.app/api/countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Failed to load countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async (countryId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://vakitler.app/api/regions?countryID=${countryId}`,
      );
      const data = await response.json();
      setRegions(data);
      setStep('region');
    } catch (error) {
      console.error('Failed to load regions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async (regionId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://vakitler.app/api/cities?regionID=${regionId}`,
      );
      const data = await response.json();
      setCities(data);
      setStep('city');
    } catch (error) {
      console.error('Failed to load cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country: ICountry) => {
    const newSettings = {
      ...settings,
      country,
      region: undefined,
    };

    // İlk kez şehir seçerken city'yi undefined yap, şehir değiştirirken yapma
    if (!showCloseButton) {
      newSettings.city = undefined;
    }

    setSettings(newSettings);
    loadRegions(country.UlkeID);
  };

  const selectRegion = (region: IRegion) => {
    const newSettings = {
      ...settings,
      region,
    };

    // İlk kez şehir seçerken city'yi undefined yap, şehir değiştirirken yapma
    if (!showCloseButton) {
      newSettings.city = undefined;
    }

    setSettings(newSettings);
    loadCities(region.SehirID);
  };

  const selectCity = async (city: ICity) => {
    const newSettings = {
      ...settings,
      city,
    };

    setSettings(newSettings);

    try {
      await fetchData(city.IlceID);
      onComplete?.();
    } catch (error) {
      console.error('Failed to fetch prayer times:', error);
      // Error will be handled by the context
    }
  };

  const goBack = () => {
    if (step === 'region') {
      setStep('country');
      setRegions([]);
    } else if (step === 'city') {
      setStep('region');
      setCities([]);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <LoadingSpinner />
        </div>
      );
    }

    switch (step) {
      case 'country':
        const filteredCountries = getFilteredData();
        return (
          <div className="flex h-full flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="relative border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('selectCountry')}
              </h3>
              {showCloseButton && (
                <button
                  onClick={() => onComplete?.()}
                  className="absolute right-6 top-6 rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Search */}
            <div className="border-b border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <input
                type="text"
                autoFocus
                placeholder={t('searchCountry')}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Country List */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredCountries.map((country) => (
                  <button
                    key={country.UlkeID}
                    onClick={() => selectCountry(country)}
                    className="w-full bg-white p-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                  >
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {country.UlkeAdi}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'region':
        const filteredRegions = getFilteredData();
        return (
          <div className="flex h-full flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="relative border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={() => {
                  goBack();
                  setSearchQuery('');
                }}
                className="mb-4 flex items-center gap-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-base font-medium">{t('back')}</span>
              </button>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('selectRegion')}
              </h3>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {settings?.country?.UlkeAdi}
              </div>
              {showCloseButton && (
                <button
                  onClick={() => onComplete?.()}
                  className="absolute right-6 top-6 rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Search */}
            <div className="border-b border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <input
                type="text"
                autoFocus
                placeholder={t('searchRegion')}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Region List */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredRegions.map((region) => (
                  <button
                    key={region.SehirID}
                    onClick={() => selectRegion(region)}
                    className="w-full bg-white p-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                  >
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {region.SehirAdi}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'city':
        const filteredCities = getFilteredData();
        return (
          <div className="flex h-full flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="relative border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={() => {
                  goBack();
                  setSearchQuery('');
                }}
                className="mb-4 flex items-center gap-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-base font-medium">{t('back')}</span>
              </button>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('selectDistrict')}
              </h3>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {settings?.country?.UlkeAdi} / {settings?.region?.SehirAdi}
              </div>
              {showCloseButton && (
                <button
                  onClick={() => onComplete?.()}
                  className="absolute right-6 top-6 rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Search */}
            <div className="border-b border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <input
                type="text"
                autoFocus
                placeholder={t('searchDistrict')}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* City List */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredCities.map((city) => (
                  <button
                    key={city.IlceID}
                    onClick={() => selectCity(city)}
                    className="w-full bg-white p-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                  >
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {city.IlceAdi}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return <div className="flex h-full w-full flex-col">{renderContent()}</div>;
}
