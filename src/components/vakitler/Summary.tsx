import { TimeNames } from '../../types/common';
import { useContext } from 'react';
import { VakitlerStoreContext } from '../../context/VakitlerStoreContext';
import { useI18nContext } from '../../context/I18nProvider';
import { usePrayerTimeNames } from '../../hooks/useI18n';
import TimeSummaryTimer from './TimeSummaryTimer';
import Container from '../ui/Container';
import RamadanTimer from './RamadanTimer';
import IslamicDate from './IslamicDate';
import { motion } from 'motion/react';

export default function Summary() {
  const { times, settings, isLoading } = useContext(VakitlerStoreContext);
  const { t, currentLanguage } = useI18nContext();
  const { getPrayerTimeName } = usePrayerTimeNames();

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-sm text-white/70">{t('prayerTimesLoading')}</div>
      </div>
    );
  }

  // If no city selected, show prompt
  if (!settings?.city?.IlceID) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center text-sm text-white/70">
          <div>{t('selectLocation')}</div>
          <div className="mt-1 text-xs opacity-75">{t('viewTimes')}</div>
        </div>
      </div>
    );
  }

  // If no times data, show message
  if (!times || !times.today) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-sm text-white/70">{t('timesNotFound')}</div>
      </div>
    );
  }

  let timeName: string =
    getPrayerTimeName(times?.time?.next as TimeNames) || '';
  if (times?.today?.isJumuah && times?.time?.next === TimeNames.Ogle) {
    timeName = t('jumuah');
  }

  return (
    <motion.div {...containerAnim}>
      <Container className="flex h-full flex-col items-center justify-center gap-1 pb-4 pt-16">
        <span className="flex text-lg font-medium capitalize md:text-xl">
          {currentLanguage === 'en'
            ? `${t('remainingTime')} ${timeName}`
            : `${timeName} ${t('remainingTime')}`}
        </span>

        <TimeSummaryTimer />

        {settings?.islamicDate && <IslamicDate className="mt-2 opacity-80" />}

        <div className="mt-3">
          <RamadanTimer />
        </div>
      </Container>
    </motion.div>
  );
}

const containerAnim = {
  variants: {
    open: {
      y: 0,
      scale: 1,
      opacity: 1,
    },
    closed: {
      y: 60,
      scale: 0.8,
      opacity: 0,
    },
  },
  transition: {
    delay: 0.3,
  },
};
