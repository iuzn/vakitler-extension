import { TimeNames } from '../../types/common';
import Container from '../ui/Container';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useContext } from 'react';
import { VakitlerStoreContext } from '../../context/VakitlerStoreContext';
import { useI18nContext } from '../../context/I18nProvider';
import { usePrayerTimeNames } from '../../hooks/useI18n';

export default function TimeListRow({
  time,
  index,
}: {
  time: TimeNames;
  index: number;
}) {
  const { times, settings } = useContext(VakitlerStoreContext);
  const { t } = useI18nContext();
  const { getPrayerTimeNameWithEmoji } = usePrayerTimeNames();

  // Early returns for safety
  if (!times || !times.today) return null;

  const value = times.today[time];

  // Additional safety check
  if (!value) return null;

  const formatTime = (timeStr: string) => {
    if (!settings?.timeFormat || settings.timeFormat === '24') {
      return timeStr;
    }
    // Convert to 12-hour format
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM'; // TODO: Add i18n for AM/PM
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const formattedValue = formatTime(value);

  const now = times?.time?.now;
  const isTimeActive = now === time;

  const next = times?.time?.next;
  const isTimeNext = next === time;

  const timeIndex = Object.keys(TimeNames).indexOf(time ?? '');
  const nowIndex = Object.keys(TimeNames).indexOf(now ?? '');

  let timeName: string = getPrayerTimeNameWithEmoji(time);

  return (
    <motion.div
      variants={{
        open: {
          y: 0,
          scale: 1,
          opacity: 1,
        },
        closed: {
          y: 30,
          scale: 0.8,
          opacity: 0,
        },
      }}
      className={cn(
        'relative h-full grow',
        now === TimeNames.Imsak && 'bg-sky-500 dark:bg-sky-500',
        now === TimeNames.Gunes && 'bg-orange-500 dark:bg-orange-500',
        now === TimeNames.Ogle && 'bg-yellow-500 dark:bg-yellow-500',
        now === TimeNames.Ikindi && 'bg-orange-500 dark:bg-orange-500',
        now === TimeNames.Aksam && 'bg-blue-500 dark:bg-blue-500',
        now === TimeNames.Yatsi && 'bg-indigo-500 dark:bg-indigo-500',
        `bg-opacity-${Math.abs((index + 1) * 5)}`,
        `dark:bg-opacity-${Math.abs((index + 1) * 5)}`,
      )}
    >
      <Container
        className={cn(
          'flex h-full',
          isTimeActive && 'py-2',
          timeIndex < nowIndex && 'opacity-60 dark:opacity-40',
        )}
      >
        <div className="relative flex h-full w-full items-center justify-between px-10 py-3 text-xl md:text-xl">
          {isTimeActive && (
            <motion.span
              layoutId="border"
              className={cn(
                'absolute inset-x-2 inset-y-1 rounded-2xl border-2 border-current',
              )}
              variants={{
                open: {
                  scale: 1,
                  opacity: 0.3,
                  transition: {
                    duration: 0.6,
                    delay: 0.6,
                  },
                },
                closed: {
                  scale: 0.9,
                  opacity: 0,
                },
              }}
            />
          )}
          <h5
            className={cn(
              'leading-none capitalize',
              timeIndex < nowIndex && 'font-normal',
            )}
          >
            {timeName}
          </h5>
          <h4
            className={cn(
              'leading-none tabular-nums',
              timeIndex < nowIndex && 'font-normal',
            )}
          >
            {formattedValue}
          </h4>
        </div>
      </Container>
    </motion.div>
  );
}
