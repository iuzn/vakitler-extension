import { useEffect } from 'react';

/**
 * Click outside hook'u - Extension'ın root elementinin dışına tıklandığında kapatır
 * Sadece content UI için çalışır, popup için çalışmaz
 */
export function useClickOutside(
  isPopup: boolean,
  isRootVisible: boolean,
  toggleRootVisibility: () => void,
  extensionId: string,
) {
  useEffect(() => {
    if (isPopup) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (event.button !== 0) return;

      // Extension'ın root elementini bul
      const extensionRoot = document.getElementById(
        extensionId + '-content-view-root',
      );
      if (!extensionRoot || !isRootVisible) return;

      // Extension root'unun dışına tıklandıysa kapat
      if (!extensionRoot.contains(event.target as Node)) {
        toggleRootVisibility();
      }
    };

    if (isRootVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRootVisible, toggleRootVisibility, isPopup, extensionId]);
}
