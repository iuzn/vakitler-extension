import { useVisibility } from '@/context/VisibilityContext';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { extensionId } from '@/lib/config';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function Main() {
  const isPopup =
    typeof window !== 'undefined' && window.location.href.includes('popup');

  // Logo URL'ini chrome API ile al (content script için gerekli)
  const logoUrl = isPopup
    ? '/logo.png'
    : typeof chrome !== 'undefined' && chrome.runtime?.getURL
      ? chrome.runtime.getURL('logo.png')
      : '/logo.png';

  const { isRootVisible, toggleRootVisibility } = isPopup
    ? { isRootVisible: true, toggleRootVisibility: () => {} }
    : useVisibility();
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close hook'u
  useClickOutside(
    isPopup,
    isRootVisible,
    () => toggleRootVisibility(false),
    extensionId,
  );

  return (
    <>
      <div className="relative h-full">
        <div
          ref={containerRef}
          className={cn(
            isPopup && 'h-full w-full bg-white dark:bg-neutral-900',
            !isPopup && [
              'fixed right-6 top-6 z-[2147483647] h-[600px] w-[420px] rounded-2xl',
              'border border-neutral-200/50 bg-white/95 shadow-2xl shadow-neutral-900/20',
              'backdrop-blur-xl transition-all duration-500 ease-out',
              'dark:border-neutral-700/50 dark:bg-neutral-900/95 dark:shadow-neutral-900/60',
              isRootVisible
                ? 'translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-[16px] scale-95 opacity-0',
            ],
          )}
        >
          {/* Header */}
          <div className="flex justify-between pr-4">
            <div className="flex items-center gap-4 py-5 pl-8">
              <img
                src={logoUrl}
                alt="Extension Logo"
                className="h-12 w-12 rounded-xl object-contain"
              />
              <div>
                <h1 className="text-xl font-semibold text-eb-700 dark:text-eb-300">
                  Extension Boilerplate
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {isPopup ? 'Popup View' : 'Content View Manager'}
                </p>
              </div>
            </div>
            <button
              onClick={() => !isPopup && toggleRootVisibility(false)}
              className={cn(
                'group mt-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200',
                isPopup
                  ? 'invisible' // Popup'ta görünmez ama layout için var
                  : 'hover:bg-eb-100 dark:hover:bg-eb-900',
              )}
            >
              <svg
                className="text-500 h-5 w-5 transition-colors duration-200 group-hover:text-eb-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex h-full flex-col px-8 pb-8">
            <div className="flex flex-1 items-start justify-center pt-[32%]">
              <div className="space-y-6 text-center">
                {/* Welcome Message */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-eb-600">
                    {isPopup ? 'Extension Popup' : 'Welcome to Boilerplate'}
                  </h2>
                  <p className="leading-relaxed text-base text-neutral-600 dark:text-neutral-400">
                    {isPopup
                      ? 'This is your extension popup. Access all features from this dedicated window.'
                      : 'This is your content view extension. Manage visibility and customize your experience with this powerful boilerplate.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
