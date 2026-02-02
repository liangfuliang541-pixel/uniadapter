# UniAdapter

**Not a framework. An open-source tool that adds cross-platform support to your existing project in 5 minutes.**

Give your React, Vue, or any JavaScript project instant support for Web, mini-programs, mobile apps, and Go distributed systems.

**[Documentation](./docs) | [Examples](./examples) | [Contributing](./CONTRIBUTING.md) | [Tests](./docs/TESTING.md) | [Brand Positioning](./BRAND_POSITIONING.md)**

## What is UniAdapter?

UniAdapter is a **platform adapter layer**, not a framework. It lets you:

- ✅ Keep your existing tech stack (React, Vue, Svelte, etc.)
- ✅ Add cross-platform support without rewriting code
- ✅ Maintain 100% control over your project structure
- ✅ Deploy to 8 platforms simultaneously

### Supported Platforms

- 🌐 **Web/H5** (Chrome, Firefox, Safari)
- 📱 **WeChat Mini Program** (wx.*)
- 🎬 **Douyin Mini Program** (tt.*)
- ❤️ **Xiaohongshu** (xhs.*)
- 🗺️ **Gaode Map** (AMap)
- ⚛️ **React Native** (Native bridge)
- 🔗 **Go Distributed Systems** (RPC, gRPC, message queues)
- 🔶 **HarmonyOS** (OHOS API)

## Why UniAdapter is Different

### Not a Framework

```
❌ You don't learn a new framework
❌ You don't rewrite your project
❌ You don't adopt new patterns
✅ You just add an adapter layer
```

### Pure Integration

```typescript
// Your existing React project
import React, { useState } from 'react'
import { useUserAPI } from './hooks/useUserAPI'

export function UserList() {
  const [users, setUsers] = useState([])
  const api = useUserAPI()

  // 100% your code, unchanged
  return <div>{/* your UI */}</div>
}

// Add multi-platform support in one line
import { useUniRouter, useUniRequest } from 'uniadapter'

// That's it. Now it works everywhere.
```

### The Core Difference

```
           uniapp                          UniAdapter
        (Framework)                      (Adapter Layer)
    ┌──────────────────┐            ┌──────────────────┐
    │  Your Code       │            │  Your React App  │
    │  + uni.* API     │            │  (unchanged)     │
    │  + Pages config  │            └────────┬─────────┘
    │  + Manifest      │                     │
    └────────┬─────────┘            ┌────────▼─────────┐
             │                      │  UniAdapter      │
    ┌────────▼─────────┐            │  useUniRouter()  │
    │ uniapp Framework │            │  useUniRequest() │
    └────────┬─────────┘            └────────┬─────────┘
             │                              │
    ┌────────▼──────────────────────────────▼─────────┐
    │      Platform Detection & Adaptation            │
    └──────────────────────────────────────────────────┘
             │
    ┌────────▼──────────────────────────────▼─────────┐
    │  Web  │ WeChat │ Douyin │ RN │ HarmonyOS │ etc. │
    └───────────────────────────────────────────────────┘

Key difference:
- uniapp: Framework decides everything
- UniAdapter: Your code stays the same, we just adapt
```

## Current Status

**v1.2.0** - Production Ready

- ✓ 98/98 tests passing (100% pass rate)
- ✓ 8 platforms fully supported
- ✓ TypeScript with complete type definitions
- ✓ Zero runtime overhead with proper tree-shaking
- ✓ Only 2KB gzipped (vs 50KB+ for traditional frameworks)

## Quick Start

### Installation

```bash
npm install uniadapter
```

### 5-Minute Integration

**Step 1**: Use in your existing React/Vue component

```typescript
import { useUniRouter, useUniRequest, usePlatform } from 'uniadapter'

function App() {
  // That's all. No config needed.
  const router = useUniRouter()
  const request = useUniRequest()
  const platform = usePlatform()
  
  // Use as normal
  return (
    <button onClick={() => router.push('/home')}>
      Go Home
    </button>
  )
}
```

**Step 2**: Build for each platform

```bash
# Web still works
npm run build

# Mini-program support activated
# Deploy to WeChat/Douyin/etc.
```

Done. Your existing project now supports all platforms.
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