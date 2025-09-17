# Extension Boilerplate

![Extension Boilerplate Logo](public/banner.png)

A minimalist, type-safe browser extension boilerplate built with cutting-edge technologies for maximum productivity and simplicity.

## 🚀 Features

- ⚡️ **Vite 7** - Lightning fast build tool with advanced HMR
- 🔒 **TypeScript 5** - Full type safety with latest features
- ⚛️ **React 19** - Latest React with modern hooks and concurrent features
- 🎨 **TailwindCSS 3.4** - Utility-first CSS framework with custom design system
- 🔄 **Advanced HMR** - Hot Module Replacement for all extension contexts
- 📦 **Manifest V3** - Modern Chrome extension standard
- 🦊 **Firefox Support** - Cross-browser compatibility with dedicated builds
- 🎯 **Dynamic SCSS Generation** - Automated Tailwind classes with dark mode support
- 🎭 **Framer Motion** - Smooth animations and transitions
- 🎨 **Iconsax React** - Beautiful icon library
- 🔧 **WebExtension Polyfill** - Cross-browser API compatibility
- 📜 **Sass Support** - Advanced CSS preprocessing
- 🛠️ **Custom Build Scripts** - Automated zipping and deployment

## 🎨 Dynamic SCSS Class Generation

One of the standout features of this boilerplate is its intelligent SCSS system that dynamically generates TailwindCSS utility classes:

### Key Features:

- **Automatic Dark Mode Support** - Every color class automatically generates its dark mode counterpart
- **Custom Color Palette** - Extension-specific color scheme with prefix system
- **Smart Class Generation** - Background, text, border, outline, ring, and shadow utilities
- **SCSS Variables** - Configurable extension ID and color schemes
- **Performance Optimized** - Only generates used classes at build time

### Example Usage:

```scss
// Automatically generates:
// .bg-w-50, .bg-w-100, .bg-w-200, ... .dark:bg-neutral-950, .dark:bg-neutral-900, etc.
// .text-w-50, .text-w-100, ... with dark mode variants
// .border-w-50, .ring-w-50, .shadow-w-50, etc.
```

This system eliminates the need for manual dark mode classes and ensures consistent theming across your extension.

## 📦 Installation

1. Clone the repository

2. Install dependencies

```bash
# Using Bun (recommended)
bun i

# Or using npm
npm install
```

3. Start development server

```bash
bun dev
```

## 🛠️ Development

### Available Scripts

- `bun dev` - Start development server with HMR
- `bun build` - Build for production
- `bun build:watch` - Build and watch for changes
- `bun build:firefox` - Build for Firefox
- `bun dev:firefox` - Start Firefox development server
- `bun lint` - Run ESLint
- `bun lint:fix` - Fix ESLint issues
- `bun prettier` - Format code

### Project Structure

```
├── src/
│   ├── components/        # Reusable React components
│   │   ├── layout/        # Layout components
│   │   └── views/         # Main view components
│   ├── context/           # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Core libraries and utilities
│   ├── pages/             # Extension entry points
│   │   ├── background/    # Background script
│   │   ├── content/       # Content scripts and styles
│   │   └── popup/         # Popup page
│   ├── shared/            # Shared components and utilities
│   ├── styles/            # Global styles and SCSS
│   └── types/             # TypeScript type definitions
├── public/                # Static assets and icons
├── utils/                 # Build tools and utilities
└── build/                 # Build output directory
```

## 🛠️ Build & Zip Script

This boilerplate includes a powerful `build.sh` script that automatically builds your extension and creates a versioned zip file:

### Features

- **Automatic Package Manager Detection** - Uses Bun if available, falls back to npm
- **Version Extraction** - Pulls version from package.json automatically
- **One-Command Build & Zip** - Build and package in a single step
- **Timestamped Archives** - Creates uniquely named zip files
- **Clean Build Process** - Removes old build artifacts

### Usage

```bash
# Build and create versioned zip file automatically
bash build.sh
```

This single command will:

1. Detect and use the appropriate package manager (Bun or npm)
2. Install dependencies if node_modules is missing
3. Extract version from package.json
4. Build the extension for production
5. Create a timestamped zip file: `build-[version]-[date].zip`
6. Clean up the build directory

### Example Output

```
build-0.0.1-2025-01-16_143052.zip
```

### Requirements

- `jq` for JSON parsing (`brew install jq`)
- Zip utility (built-in on macOS/Linux)
- Bun or npm

### What Makes This Special

Unlike other boilerplates, our build script:

- ✅ **One-command deployment** - No manual zipping required
- ✅ **Smart dependency management** - Auto-installs if needed
- ✅ **Cross-platform compatibility** - Works on macOS, Linux, and Windows (WSL)
- ✅ **Version-aware** - Uses your package.json version in filenames
- ✅ **Clean output** - No leftover files after zipping

## 🏗️ Building for Production

1. Build the extension:

```bash
bun build
```

2. Load the extension:
   - Open Chrome/Firefox
   - Navigate to extensions page (`chrome://extensions` or `about:debugging`)
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `build` directory

## 🔧 Configuration

### Manifest Configuration

Modify `manifest.js` to customize extension settings:

- Permissions
- Icons
- Content Scripts
- Background Scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Disclaimer

This boilerplate is inspired by and references code from [Jonghakseo/chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite). While we've adapted and simplified the original template for our specific needs, we acknowledge that some concepts, configurations, and code structures are derived from this excellent open-source project.

**Important**: This is not an official fork or derivative work. We've created our own implementation while learning from the original repository's architecture and best practices. All credit for the original innovative concepts goes to the original authors.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Core Technologies

- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)

### Inspiration & Learning Resources

- [Jonghakseo/chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite) - Original boilerplate that inspired this project
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- [Iconsax](https://iconsax.io/) - Beautiful icon library

### Special Thanks

Special thanks to the original chrome-extension-boilerplate-react-vite project for pioneering modern extension development practices and providing excellent architectural patterns that we've adapted and simplified for this minimalist template.
