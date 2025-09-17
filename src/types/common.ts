import type { PropsWithChildren } from 'react';
import { Times } from '../models/times';

export type WithChildren<T = {}> = T & PropsWithChildren<{}>;
export type WithClassName<T = {}> = T & {
  className?: string;
};
export type QueryParams = {
  [key: string]: string | number | null;
};
export interface SequentialLoading {
  ok: boolean;
  id: number | string | null;
}

// Vakitler Extension Types
export type TypeTimer = [number, number, number];

export interface ICountry {
  UlkeAdi: string; // "ABD",
  UlkeAdiEn: string; // "USA",
  UlkeID: string; // "33"
}

export interface IRegion {
  SehirAdi: string; // "ADIYAMAN";
  SehirAdiEn: string; // "ADIYAMAN";
  SehirID: string; // "501";
}

export interface ICity {
  IlceAdi: string; // "ARNAVUTKOY";
  IlceAdiEn: string; // "ARNAVUTKOY";
  IlceID: string; // "9535";
}

export interface ITime {
  Imsak: string;
  Gunes: string;
  Ogle: string;
  Ikindi: string;
  Aksam: string;
  Yatsi: string;
  KibleSaati: string;
  HicriTarihUzun: string; // "8 Şaban 1444";
  MiladiTarihKisa: string; // "28.02.2023";
  AyinSekliURL: string; // "http://namazvakti.diyanet.gov.tr/images/i7.gif";
  [key: string]: string;
}

export enum TimeNames {
  Imsak = 'Imsak',
  Gunes = 'Gunes',
  Ogle = 'Ogle',
  Ikindi = 'Ikindi',
  Aksam = 'Aksam',
  Yatsi = 'Yatsi',
}

export interface IRelease {
  id: number;
  draft: boolean;
  name: string;
  body: string;
  prerelease: boolean;
  published_at: string;
  tag_name: string;
  url: string;
}

export interface IVakitlerStore {
  settings: {
    country?: ICountry;
    _country?: ICountry;
    region?: IRegion;
    _region?: IRegion;
    city?: import('../shared/storages/base').CitySettings;
    _city?: import('../shared/storages/base').CitySettings;
    timeFormat: import('../shared/storages/base').TimeFormat;
    adjustments: number[];
    islamicDate: boolean;
    ramadanTimer: boolean;
    language?: 'tr' | 'en'; // Optional language preference
  };
  setSettings: (value: IVakitlerStore['settings']) => void;
  fetchData: (cityId: string) => Promise<void>;
  times: undefined | Times;
  rawTimes: undefined | Times;
  timer: TypeTimer;
  timerRamadan: TypeTimer;
  releases: IRelease[];
  saveSettings: (settings: IVakitlerStore['settings']) => void;
}
