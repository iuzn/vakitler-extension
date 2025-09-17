import { cn } from '../../lib/utils';
import { useI18nContext } from '../../context/I18nProvider';

interface ErrorDisplayProps {
  error: Error;
  retry?: () => void;
}

export const ErrorDisplay = ({ error, retry }: ErrorDisplayProps) => {
  const { t } = useI18nContext();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-4 text-center',
      )}
    >
      <div className="mb-2 text-red-400">
        <svg
          className="mx-auto h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{t('error')}</h3>
      <p className="mb-4 text-sm text-gray-300">{error.message}</p>
      {retry && (
        <button
          onClick={retry}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          {t('retry')}
        </button>
      )}
    </div>
  );
};
