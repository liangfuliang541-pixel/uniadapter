# UniAdapter CHANGELOG

## [Unreleased]

### Added
- Skeleton Next.js adapter (`src/core/adapters/nextjs.ts`)
- Skeleton Nuxt adapter (`src/core/adapters/nuxt.ts`)
- Basic plugin system scaffold (`src/core/plugin.ts`)
- i18n TypeScript definitions (`src/core/types/i18n.ts`)

### Changed
- Platform detection extended for Next.js and Nuxt (`src/core/types/platform.ts`)
- Export routing to support Next/Nuxt in adapters index (`src/core/adapters/index.ts`)
- Bumped `package.json` version to `1.3.0` (draft)

---

## Roadmap (A → F)
- A [v1.3.0] Architecture refactor
- B Architecture refactor complete
- C Plugin system implementation
- D Visual configuration tool
- E Cloud platform integration
- F [v2.0.0] Release
