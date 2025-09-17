import { useContext } from 'react';
import { VakitlerStoreContext } from '../../context/VakitlerStoreContext';
import { useI18nContext } from '../../context/I18nProvider';
import { cn } from '../../lib/utils';

interface IslamicDateProps {
  className?: string;
}

export default function IslamicDate({ className }: IslamicDateProps) {
  const { times, settings } = useContext(VakitlerStoreContext);
  const { currentLanguage } = useI18nContext();

  // Get current date
  const now = new Date();

  // Create Islamic date using Intl.DateTimeFormat with Islamic calendar
  const date = new Intl.DateTimeFormat(
    currentLanguage === 'tr' ? 'tr-TR' : 'en-US',
    {
      calendar: 'islamic',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  ).format(now);

  if (!settings?.islamicDate) return null;

  return <div className={cn('text-sm opacity-80', className)}>{date}</div>;
}
