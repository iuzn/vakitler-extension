import { ReactNode, useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TimeNames } from '@/types/common';
import { VakitlerStoreContext } from '@/context/VakitlerStoreContext';
import { motion } from 'motion/react';

const themeStyle = {
  [TimeNames.Imsak]: cn(
    'bg-Imsak-light dark:bg-Imsak-dark',
    'text-sky-800 dark:text-sky-200',
  ),
  [TimeNames.Gunes]: cn(
    'bg-Gunes-light dark:bg-Gunes-dark',
    'text-orange-800 dark:text-orange-200',
  ),
  [TimeNames.Ogle]: cn(
    'bg-Ogle-light dark:bg-Ogle-dark',
    'text-yellow-800 dark:text-yellow-200',
  ),
  [TimeNames.Ikindi]: cn(
    'bg-Ikindi-light dark:bg-Ikindi-dark',
    'text-orange-800 dark:text-orange-200',
  ),
  [TimeNames.Aksam]: cn(
    'bg-Aksam-light dark:bg-Aksam-dark',
    'text-blue-800 dark:text-blue-200',
  ),
  [TimeNames.Yatsi]: cn(
    'bg-Yatsi-light dark:bg-Yatsi-dark',
    'text-indigo-800 dark:text-indigo-200',
  ),
};

// Theme colors for meta tag
const themeColors = {
  [TimeNames.Imsak]: { light: '#daf2fe', dark: '#192b3b' },
  [TimeNames.Gunes]: { light: '#feead6', dark: '#40221a' },
  [TimeNames.Ogle]: { light: '#fef6cc', dark: '#3a281a' },
  [TimeNames.Ikindi]: { light: '#ffedd5', dark: '#421a25' },
  [TimeNames.Aksam]: { light: '#e0edff', dark: '#1b2448' },
  [TimeNames.Yatsi]: { light: '#e4e8fe', dark: '#212044' },
};

export default function Layout({ children }: { children: ReactNode }) {
  const { times } = useContext(VakitlerStoreContext);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!times) return;
    setStart(true);
  }, [times]);

  const now: TimeNames = times!.time.now;

  const themeColor = document.documentElement.classList.contains('dark')
    ? themeColors[now]['dark']
    : themeColors[now]['light'];

  return (
    <div className={cn('fixed inset-0 bg-white dark:bg-zinc-900')}>
      {themeColor && <meta name="theme-color" content={themeColor} />}

      <div className={cn(themeStyle[now], 'h-screen')}>
        <motion.div
          initial={false}
          animate={start ? 'open' : 'closed'}
          className={cn(
            'h-full select-none',
            'grid grid-rows-[minmax(auto,_1fr)_minmax(auto,_460px)]',
            'md:grid-rows-[minmax(auto,_1fr)_minmax(auto,_600px)]',
          )}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
