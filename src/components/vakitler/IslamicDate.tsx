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

  if (!settings?.islamicDate) return null;

  const now = new Date();
  const adjustment = settings?.islamicDateAdjustment || 0;
  if (adjustment !== 0) {
    now.setDate(now.getDate() + adjustment);
  }

  const date = new Intl.DateTimeFormat(
    currentLanguage === 'tr' ? 'tr-TR' : 'en-US',
    {
      calendar: 'islamic',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  ).format(now);

  return <div className={cn('text-sm opacity-80', className)}>{date}</div>;
}
