import { ITime, TimeNames } from '../types/common';

export class Time implements ITime {
  Imsak: string;
  Gunes: string;
  Ogle: string;
  Ikindi: string;
  Aksam: string;
  Yatsi: string;
  KibleSaati: string;
  HicriTarihUzun: string;
  MiladiTarihKisa: string;
  AyinSekliURL: string;
  [key: string]: string;

  constructor(data: ITime) {
    this.Imsak = data.Imsak;
    this.Gunes = data.Gunes;
    this.Ogle = data.Ogle;
    this.Ikindi = data.Ikindi;
    this.Aksam = data.Aksam;
    this.Yatsi = data.Yatsi;
    this.KibleSaati = data.KibleSaati;
    this.HicriTarihUzun = data.HicriTarihUzun;
    this.MiladiTarihKisa = data.MiladiTarihKisa;
    this.AyinSekliURL = data.AyinSekliURL;
  }

  get moonKey(): string {
    // Simple implementation - you can expand this
    return 'dolunay';
  }

  set moonKey(value: string) {
    // Allow setting for compatibility
  }
}
