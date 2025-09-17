import { ITime, TimeNames, TypeTimer } from '../types/common';
import { secondSplit } from '../lib/utils';
import { HOUR_FORMAT } from '../utils/const';
import { Time } from './time';

const timeNames = Object.values(TimeNames);

export class Times {
  public times: Time[];
  public rawTimes: Time[]; // Store original data
  public localTime: Date;
  public timeTravel: [number, number, number];
  public adjustments: number[];

  constructor(
    data: ITime[] = [],
    adjustments: number[] = timeNames.map(() => 0),
  ) {
    this.adjustments = adjustments;
    // Store raw data without modifications
    this.rawTimes = data.map((day) => new Time(day));
    // Create working copy for adjustments
    this.times = data.map((day) => new Time(day));
    this.localTime = new Date();
    this.timeTravel = [0, 0, 0];

    // Apply adjustments if any exist
    this.applyAdjustments(adjustments);
  }

  applyAdjustments(adjustments: number[]) {
    // Reset times to raw data first
    this.times = this.rawTimes.map((day) => new Time(day as ITime));

    // Apply adjustments if any exist
    if (adjustments.some((a) => a !== 0)) {
      this.times.forEach((day) => {
        timeNames.forEach((time, i) => {
          if (adjustments[i] !== 0) {
            const timeValue = this.parseTime(day[time as keyof Time] as string);
            timeValue.setMinutes(timeValue.getMinutes() + adjustments[i]);
            day[time as keyof Time] = this.formatTime(timeValue);
          }
        });
      });
    }
  }

  // Update adjustments and reapply them
  updateAdjustments(adjustments: number[]) {
    console.log('Updating adjustments to:', adjustments);
    this.adjustments = [...adjustments];
    this.applyAdjustments(adjustments);
  }

  private parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  updateTimeTravel(value: [number, number, number]): void {
    this.timeTravel = value;
  }

  updateDateTime(datetime: Date): void {
    this.localTime = datetime;
  }

  get today(): undefined | Time {
    return this.times.find((o) => {
      const day = this.localTime.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return o.MiladiTarihKisa === day;
    });
  }

  get tomorrow(): undefined | Time {
    return this.times.find((o) => {
      const tomorrow = new Date(this.localTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const day = tomorrow.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return o.MiladiTarihKisa === day;
    });
  }

  get yesterday(): undefined | Time {
    return this.times.find((o) => {
      const yesterday = new Date(this.localTime);
      yesterday.setDate(yesterday.getDate() - 1);
      const day = yesterday.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return o.MiladiTarihKisa === day;
    });
  }

  get time(): { now: TimeNames; next: TimeNames } {
    if (!this.today) return { now: TimeNames.Imsak, next: TimeNames.Imsak };

    const Imsak = this.parseTime(this.today[TimeNames.Imsak]);
    const Gunes = this.parseTime(this.today[TimeNames.Gunes]);
    const Ogle = this.parseTime(this.today[TimeNames.Ogle]);
    const Ikindi = this.parseTime(this.today[TimeNames.Ikindi]);
    const Aksam = this.parseTime(this.today[TimeNames.Aksam]);
    const Yatsi = this.parseTime(this.today[TimeNames.Yatsi]);

    // Set dates to today
    Imsak.setFullYear(
      this.localTime.getFullYear(),
      this.localTime.getMonth(),
      this.localTime.getDate(),
    );
    Gunes.setFullYear(
      this.localTime.getFullYear(),
      this.localTime.getMonth(),
      this.localTime.getDate(),
    );
    Ogle.setFullYear(
      this.localTime.getFullYear(),
      this.localTime.getMonth(),
      this.localTime.getDate(),
    );
    Ikindi.setFullYear(
      this.localTime.getFullYear(),
      this.localTime.getMonth(),
      this.localTime.getDate(),
    );
    Aksam.setFullYear(
      this.localTime.getFullYear(),
      this.localTime.getMonth(),
      this.localTime.getDate(),
    );
    Yatsi.setFullYear(
      this.localTime.getFullYear(),
      this.localTime.getMonth(),
      this.localTime.getDate(),
    );

    // Default values = Yatsi
    const obj: { now: TimeNames; next: TimeNames } = {
      now: TimeNames.Yatsi,
      next: TimeNames.Imsak,
    };

    if (this.localTime >= Imsak && this.localTime < Gunes) {
      obj.now = TimeNames.Imsak;
      obj.next = TimeNames.Gunes;
    } else if (this.localTime >= Gunes && this.localTime < Ogle) {
      obj.now = TimeNames.Gunes;
      obj.next = TimeNames.Ogle;
    } else if (this.localTime >= Ogle && this.localTime < Ikindi) {
      obj.now = TimeNames.Ogle;
      obj.next = TimeNames.Ikindi;
    } else if (this.localTime >= Ikindi && this.localTime < Aksam) {
      obj.now = TimeNames.Ikindi;
      obj.next = TimeNames.Aksam;
    } else if (this.localTime >= Aksam && this.localTime < Yatsi) {
      obj.now = TimeNames.Aksam;
      obj.next = TimeNames.Yatsi;
    }

    return obj;
  }

  isBeforeMidnight(): boolean {
    if (!this.today) return false;

    return this.localTime > this.parseTime(this.today[TimeNames.Imsak]);
  }

  timer(): TypeTimer {
    if (!this.today || !this.tomorrow) return [0, 0, 0];

    let dateTime = this.parseTime(this.today[this.time.next]);

    if (this.time.now === TimeNames.Yatsi) {
      dateTime = this.parseTime(this.today[TimeNames.Imsak]);

      if (this.isBeforeMidnight()) {
        dateTime = this.parseTime(this.tomorrow[TimeNames.Imsak]);
        dateTime.setDate(dateTime.getDate() + 1);
      }
    }

    const ms = dateTime.getTime() - this.localTime.getTime();

    return secondSplit(ms / 1000);
  }

  timerRamadan(): TypeTimer {
    if (!this.today || !this.tomorrow) return [0, 0, 0];

    let dateTime = this.parseTime(this.today[TimeNames.Aksam]);

    if ([TimeNames.Aksam, TimeNames.Yatsi].includes(this.time.now)) {
      dateTime = this.parseTime(this.tomorrow[TimeNames.Imsak]);
      dateTime.setDate(dateTime.getDate() + 1);
    }

    const ms = dateTime.getTime() - this.localTime.getTime();

    return secondSplit(ms / 1000);
  }

  get iconName(): string {
    if (!this.today || !this.yesterday) return 'dolunay';

    let key = this.time.now as string;

    if (this.time.now === TimeNames.Aksam) {
      key = this.today.moonKey;
    } else if (this.time.now === TimeNames.Yatsi) {
      key = this.today.moonKey;

      if (!this.isBeforeMidnight()) {
        key = this.yesterday.moonKey;
      }
    }

    return key;
  }
}
