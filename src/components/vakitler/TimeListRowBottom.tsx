import { TimeNames } from '../../types/common';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useContext } from 'react';
import { VakitlerStoreContext } from '../../context/VakitlerStoreContext';

export default function TimeListRowBottom({}: {}) {
  const { times } = useContext(VakitlerStoreContext);

  const now = times?.time?.now;

  if (!times) return null;

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
        'h-full min-h-4',
        now === TimeNames.Imsak && 'bg-sky-500 dark:bg-sky-500',
        now === TimeNames.Gunes && 'bg-orange-500 dark:bg-orange-500',
        now === TimeNames.Ogle && 'bg-yellow-500 dark:bg-yellow-500',
        now === TimeNames.Ikindi && 'bg-orange-500 dark:bg-orange-500',
        now === TimeNames.Aksam && 'bg-blue-500 dark:bg-blue-500',
        now === TimeNames.Yatsi && 'bg-indigo-500 dark:bg-indigo-500',
        `bg-opacity-${Math.abs(7 * 5)}`,
        `dark:bg-opacity-${Math.abs(7 * 5)}`,
      )}
    />
  );
}
