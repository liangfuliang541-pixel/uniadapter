# UniAdapter

Cross-platform JavaScript framework with unified APIs for Web, mini-programs, mobile apps, and Go distributed systems.

**[Documentation](./docs) | [Examples](./examples) | [Contributing](./CONTRIBUTING.md) | [Tests](./docs/TESTING.md)**

## Overview

UniAdapter eliminates platform-specific code by providing a single API surface that works across:

- Web/H5 (Chrome, Firefox, Safari)
- WeChat Mini Program
- Douyin Mini Program
- Xiaohongshu Mini Program
- Gaode Map
- React Native
- Go Distributed Systems
- HarmonyOS

## Current Status

**v1.2.0** - Production Ready

- ✓ 98/98 tests passing (100% pass rate)
- ✓ 8 platforms fully supported
- ✓ TypeScript with complete type definitions
- ✓ Zero runtime overhead with proper tree-shaking

## Quick Start

### Installation

```bash
npm install uniadapter
```

### Basic Usage

```typescript
import { useUniRouter, useUniRequest, usePlatform } from 'uniadapter'

function App() {
  const router = useUniRouter()
  const request = useUniRequest()
  const platform = usePlatform()
  
  // Same API works on all platforms
  router.push('/profile')
  request.get('/api/data')
  console.log(platform.name)
}
```

## Architecture

The framework uses the Adapter pattern for clean platform abstraction:

```
Application Code
      ↓
Unified Hook API (useUniRouter, useUniRequest, etc.)
      ↓
Platform-Specific Adapters (WeChat, Douyin, H5, etc.)
      ↓
Native Platform APIs
```

Each platform implements the same interface with its native APIs:

```typescript
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}
```

## Key Features

- **Unified APIs**: Single hook interface across all platforms
- **Automatic Detection**: Platform detection on startup
- **Type Safe**: Full TypeScript with inference
- **Performance**: Tree-shakeable, minimal bundle impact
- **Error Handling**: Graceful degradation with fallbacks
- **Extensible**: Custom adapters for additional platforms

## Platform-Specific Adapters

### Core Adapters

| Adapter | Status | Features |
|---------|--------|----------|
| H5 | Stable | localStorage, fetch, history API |
| WeChat | Stable | wx.* API integration |
| Douyin | Stable | tt.* API integration |
| Xiaohongshu | Stable | xhs.* API integration |
| Gaode Map | Stable | AMap API integration |
| React Native | Stable | Native module bridges |
| Go Distributed | v1.2.0 | RPC, message queues, service discovery |
| HarmonyOS | v1.2.0 | OHOS API support |

### What Each Adapter Provides

**Storage Adapter**
- get/set/remove/clear operations
- Platform-native storage (localStorage, wx.storage, etc.)
- In-memory fallback for test environments

**Request Adapter**
- HTTP methods (GET, POST, PUT, DELETE)
- Platform-specific request APIs
- Automatic error handling

**Router Adapter**
- Navigation (push, replace, goBack)
- Platform-specific routing (navigateTo, navigateBack, etc.)

## Core Hooks API

### useUniRouter()

```typescript
const { push, replace, goBack } = useUniRouter()

// Navigate to new page
await router.push('/home')

// Replace current page
await router.replace('/profile')

// Go back to previous page
await router.goBack()
```

### useUniRequest()

```typescript
const { get, post, put, del } = useUniRequest()

// GET request
const data = await request.get('/api/users')

// POST request
await request.post('/api/users', { name: 'John' })

// PUT request
await request.put('/api/users/1', { name: 'Jane' })

// DELETE request
await request.del('/api/users/1')
```

### useUniState()

```typescript
const [state, setState] = useUniState(initialValue)

// Update state
setState(newValue)

// Update with function
setState(prev => prev + 1)
```

### usePlatform()

```typescript
const platform = usePlatform()
// {
//   name: 'h5' | 'weapp' | 'douyin' | ...
//   type: 'web' | 'mini-program' | 'app' | 'distributed'
//   isWeb: boolean
//   isMiniProgram: boolean
//   isApp: boolean
//   isMobile: boolean
// }
```

## Testing

Run the full test suite:

```bash
npm run test:run
```

**Current status**: 98/98 tests passing (100%)

See [Testing Guide](./docs/TESTING.md) for details on test strategy and debugging.

## Building

```bash
npm run build
npm run build:lib     # Library build
npm run type-check    # TypeScript validation
npm run lint         # Code style check
```

## Documentation

- [Architecture Guide](./docs/project-overview.md) - Design patterns and system design
- [Getting Started](./docs/usage-guide.md) - Basic usage and common patterns
- [API Reference](./docs/api-reference.md) - Complete API documentation
- [Go Integration](./docs/go-integration.md) - Microservices and distributed systems
- [Testing Guide](./docs/TESTING.md) - Test strategy and results

## Project Structure

```
src/
├── core/
│   ├── adapters/          Platform implementations
│   ├── types/             Type definitions
│   └── adapter.interface.ts
├── hooks/                 React hook APIs
├── lib/                   Utilities
└── test/                  Test utilities

docs/                      Documentation
examples/                  Usage examples
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](./LICENSE) for details

## Contact

- Email: 3578544805@qq.com
- Issues: [GitHub Issues](https://github.com/liangfuliang541-pixel/uniadapter/issues)