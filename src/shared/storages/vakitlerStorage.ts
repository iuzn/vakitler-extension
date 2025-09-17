import {
  createStorage,
  VakitlerSettings,
  PrayerTimeData,
  StorageType,
} from './base';

/**
 * Vakitler extension storage instances
 */

// Settings storage
export const vakitlerSettings = createStorage<VakitlerSettings | null>(
  'VAKITLER_SETTINGS',
  null,
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

// Prayer times data storage
export const vakitlerData = createStorage<PrayerTimeData[]>(
  'VAKITLER_DATA',
  [],
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

// Last update timestamp storage
export const vakitlerLastUpdate = createStorage<number>(
  'VAKITLER_LAST_UPDATE',
  0,
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);
