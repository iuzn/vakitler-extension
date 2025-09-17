import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

/**
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'tr',
  // Ensure locales are properly referenced
  // Chrome will automatically load _locales from the extension root

  name: 'Vakitler',
  version: packageJson.version,
  description: 'Namaz vakitlerini gösteren pratik tarayıcı uzantısı',
  // Vakitler extension permissions
  permissions: ['storage', 'alarms', 'tabs'],
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_title: 'Vakitler - Namaz Vakitleri',
    default_icon: 'icon-48.png',
    default_popup: 'src/pages/popup/index.html',
  },
  icons: {
    16: 'icon-16.png',
    32: 'icon-32.png',
    48: 'icon-48.png',
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/pages/contentUI/index.js'],
      run_at: 'document_end',
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'assets/js/*.js',
        'assets/css/*.css',
        'icon-16.png',
        'icon-32.png',
        'icon-48.png',
        'icon-128.png',
        'logo.png',
      ],
      matches: ['*://*/*'],
    },
  ],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
};

export default manifest;
