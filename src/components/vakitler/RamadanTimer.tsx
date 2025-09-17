import { HTMLAttributes, useContext } from 'react';
import { VakitlerStoreContext } from '../../context/VakitlerStoreContext';
import { useI18nContext } from '../../context/I18nProvider';
import { TimeNames } from '../../types/common';

export default function RamadanTimer() {
  const { t } = useI18nContext();
  const { timerRamadan, times, settings } = useContext(VakitlerStoreContext);

  const now = times?.time?.next;

  if (!now) return null;

  if (!settings?.ramadanTimer) return null;

  // İftar gösterim mantığı:
  // - İmsak vakti: İftar göstermeme (çok uzak)
  // - Güneş, Öğle, İkindi: İftar gösterilmeli
  // - Akşam, Yatsı: İftar göstermeme (geçmiş veya çok uzak)
  if (
    [TimeNames.Imsak, TimeNames.Aksam, TimeNames.Yatsi].includes(
      now as TimeNames,
    )
  )
    return null;

  return (
    <div className="relative z-0 flex items-center gap-1 px-4 py-1 text-base md:text-xl">
      <span className="absolute inset-0 -z-10 rounded-xl bg-white bg-opacity-80 shadow dark:bg-black dark:bg-opacity-20" />

      <span className="capitalize">{t('iftarTime')}</span>

      <span className="flex items-center gap-1">
        {timerRamadan[0] > 0 && (
          <span className="gap-px flex items-baseline">
            <span className="font-semibold tabular-nums">
              {timerRamadan[0]}
            </span>
            <span>{t('hourShort')}</span>
          </span>
        )}
        <span className="gap-px flex items-baseline">
          <span className="font-semibold tabular-nums">{timerRamadan[1]}</span>
          <span>{t('minuteShort')}</span>
        </span>
      </span>
    </div>
  );
}
