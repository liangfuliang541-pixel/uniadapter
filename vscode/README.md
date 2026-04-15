# UniAdapter VibeDevTools

VS Code extension for AI-powered cross-platform mini-program development.

## Features

- **🌀 VibeEngine** - Describe a page in natural language, get complete cross-platform code
- **📦 Component Explorer** - Browse the VibeUI component registry
- **✨ Quick Generate** - `Ctrl+Shift+P` → `VibeEngine` to generate pages from command palette
- **📁 Insert Components** - Click any component in the explorer to insert it into your project
- **🔄 Platform Switching** - Generate for WeChat / Alipay / Douyin / H5

## Installation

1. Open VS Code
2. Run: `Extensions: Install from VSIX...`
3. Select the built `.vsix` package

Or publish to VS Code Marketplace using `vsce publish`.

## Usage

### Quick Generate (Command Palette)
```
Ctrl+Shift+P → "VibeEngine: AI Generate Page"
```

### Open VibeDevTools Panel
```
Ctrl+Shift+P → "UniAdapter: Open VibeDevTools"
```

### Component Explorer
Click any component in the UniAdapter Components tree in the Explorer sidebar.

## Requirements

- VS Code 1.85+
- Node.js 18+

## Building

```bash
npm install
npm run compile    # Compile TypeScript
npx vsce package  # Package as .vsix
```

## Publishing

```bash
npx vsce login <publisher>
npx vsce publish
```

## Links

- [UniAdapter GitHub](https://github.com/liangfuliang541-pixel/uniadapter)
- [VS Code Extension Marketplace](https://marketplace.visualstudio.com/)
