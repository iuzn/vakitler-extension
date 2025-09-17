import { cn } from '../../lib/utils';
import { useContext } from 'react';
import { VakitlerStoreContext } from '../../context/VakitlerStoreContext';
import { useI18nContext } from '../../context/I18nProvider';
import { motion } from 'motion/react';

interface LocationProps {
  onSettingsClick?: () => void;
}

export default function Location({ onSettingsClick }: LocationProps) {
  const { settings } = useContext(VakitlerStoreContext);
  const { t } = useI18nContext();

  return (
    <motion.div
      className={cn('absolute inset-x-0 top-4 z-20 text-center')}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <button
        onClick={onSettingsClick}
        className="relative inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium uppercase tracking-wider"
        type="button"
      >
        <span className="absolute inset-0 -z-10 rounded-3xl bg-white dark:bg-white/10" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          viewBox="0 0 24 24"
          strokeWidth="1.4"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M4 6l8 0" />
          <path d="M16 6l4 0" />
          <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M4 12l2 0" />
          <path d="M10 12l10 0" />
          <path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M4 18l11 0" />
          <path d="M19 18l1 0" />
        </svg>
        <span>{settings?.city?.IlceAdi || t('selectCity')}</span>
      </button>
    </motion.div>
  );
}
