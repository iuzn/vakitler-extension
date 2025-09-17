// src/pages/content/ui/root.tsx
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectedStyle from './injected.css?inline';
import App from '@/pages/content/ui/app';
import { extensionId } from '@/lib/config';

refreshOnUpdate('src/pages/content');

const root = document.createElement('div');
root.id = extensionId + '-content-view-root';
// root.style.all = 'initial';
root.style.fontSize = '16px';
root.style.display = 'block';
root.style.visibility = 'hidden';
document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = extensionId + '-app';
rootIntoShadow.style.display = 'block';

const shadowRoot = root.attachShadow({ mode: 'open' });
shadowRoot.appendChild(rootIntoShadow);

const styleElement = document.createElement('style');
styleElement.innerHTML = injectedStyle;
shadowRoot.appendChild(styleElement);

const documentStyleElement = document.createElement('style');

document.head.appendChild(documentStyleElement);
createRoot(rootIntoShadow).render(<App />);

(function (history) {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function (...args) {
    const result = pushState.apply(history, args);
    window.dispatchEvent(new Event('locationchange'));
    return result;
  };

  history.replaceState = function (...args) {
    const result = replaceState.apply(history, args);
    window.dispatchEvent(new Event('locationchange'));
    return result;
  };

  window.addEventListener('popstate', function () {
    window.dispatchEvent(new Event('locationchange'));
  });
})(window.history);
