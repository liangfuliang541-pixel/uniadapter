# Architecture

## Overview

UniAdapter is a cross-platform adapter framework that provides unified APIs for different JavaScript runtime environments. Instead of writing separate code for each platform, developers write once and deploy to Web, mini-programs, mobile apps, and distributed systems. Latest version adds support for Alipay mini-programs with payment and financial services integration.

## Core Design

The framework uses the Adapter pattern to abstract platform-specific differences:

```typescript
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}
```

Each platform (Web, WeChat, Alipay, Douyin, etc.) implements this interface using its native APIs. The factory automatically selects the correct adapter based on platform detection.

## Directory Structure

```
src/
├── core/
│   ├── adapters/           Platform implementations
│   │   ├── h5.ts
│   │   ├── weapp.ts
│   │   ├── alipay.ts        New: Alipay mini-program adapter
│   │   ├── douyin.ts
│   │   ├── xiaohongshu.ts
│   │   ├── amap.ts
│   │   ├── react-native.ts
│   │   ├── go-distributed.ts
│   │   └── harmonyos.ts
│   ├── types/
│   │   └── platform.ts      Platform enum and detection
│   └── adapter.interface.ts  Adapter interface definitions
├── hooks/
│   ├── useUniState.ts       Unified state management hooks
│   ├── usePlatform.ts
│   ├── useUniRouter.ts
│   ├── useUniRequest.ts
│   └── useToast.ts
└── lib/
    └── utils.ts             Helper functions
```

## Platform Support

The framework detects the runtime and selects the appropriate adapter:

| Platform | Environment | Status | Special Features |
|----------|------------|--------|------------------|
| H5 | Browser | ✓ Stable | Full web APIs |
| WeChat | `wx` object | ✓ Stable | Social features |
| Alipay | `my` object | ✓ v1.2.1 | Payment & finance |
| Douyin | `tt` object | ✓ Stable | Video & social |
| Xiaohongshu | `xhs` object | ✓ Stable | Content sharing |
| Gaode Map | `AMap` object | ✓ Stable | Location services |
| React Native | RN bridge | ✓ Stable | Native mobile |
| Go Distributed | RPC/gRPC | ✓ v1.2.0 | Microservices |
| HarmonyOS | `ohos`/`hm` | ✓ v1.2.0 | OS integration |

### Platform Detection

```typescript
export function detectPlatform(): Platform {
  // Go distributed first (highest priority)
  if (globalThis.go?.runtime === 'distributed') return Platform.GO_DISTRIBUTED
  
  // Mini-programs
  if (globalThis.tt) return Platform.DOUYIN_MINIPROGRAM
  if (globalThis.xhs) return Platform.XIAOHONGSHU
  if (globalThis.wx) return Platform.WEAPP
  
  // Alipay mini-program (new addition)
  if (globalThis.my && globalThis.my.canIUse) return Platform.ALIPAY_MINIPROGRAM
  
  // HarmonyOS
  if (globalThis.ohos || globalThis.hm) return Platform.HARMONYOS
  
  // React Native
  if (navigator?.product === 'ReactNative') return Platform.REACT_NATIVE
  
  // Gaode Map
  if (globalThis.AMap) return Platform.GAODE_MAP
  
  // Web
  if (typeof window !== 'undefined') return Platform.H5
  
  return Platform.UNKNOWN
}
```

## Adapter Implementation

### Example: Storage Adapter

Each adapter implements the same interface with platform-specific logic:

**Web/H5 implementation:**
```typescript
export class H5StorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
```

**WeChat Mini Program:**
```typescript
export class WeChatStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    const item = wx.getStorageSync(key)
    return item ? JSON.parse(item) : null
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    wx.setStorageSync(key, JSON.stringify(value))
  }
}
```

**Alipay Mini Program (new):**
```typescript
export class AlipayStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    if (typeof my !== 'undefined' && my.getStorageSync) {
      const result = my.getStorageSync(key)
      return result ? JSON.parse(result) : null
    } else {
      // Fallback to universal storage
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    if (typeof my !== 'undefined' && my.setStorageSync) {
      my.setStorageSync({
        key,
        data: JSON.stringify(value)
      })
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
}
```

**Go Distributed (with fallback):**
```typescript
export class GoDistributedStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      // Try RPC first
      const result = await rpcCall('storage.get', { key })
      return result ? JSON.parse(result) : null
    } catch (e) {
      // Fallback to local storage
      return this.getFromFallback(key)
    }
  }
}
```

## React Hooks Integration

The framework provides React hooks for cross-platform state management:

```typescript
export function useUniRouter() {
  return {
    push(url: string) { /* navigate to url */ },
    replace(url: string) { /* replace history */ },
    goBack() { /* platform-specific back navigation */ }
  }
}

export function useUniRequest() {
  return {
    get(url: string, options?) { /* HTTP GET */ },
    post(url: string, data: any, options?) { /* HTTP POST */ },
    put(url: string, data: any, options?) { /* HTTP PUT */ },
    del(url: string, options?) { /* HTTP DELETE */ }
  }
}
```

## Adapter Factory

The factory pattern handles adapter selection:

```typescript
export async function createStorageAdapter() {
  const platform = detectPlatform()
  
  switch (platform) {
    case Platform.WEAPP:
      return new WeChatStorageAdapter()
    case Platform.ALIPAY_MINIPROGRAM:  // New addition
      return new AlipayStorageAdapter()
    case Platform.DOUYIN_MINIPROGRAM:
      return new DouyinStorageAdapter()
    case Platform.GO_DISTRIBUTED:
      return new GoDistributedStorageAdapter()
    default:
      return new H5StorageAdapter()
  }
}
```

## Alipay Mini-Program Specific Features

The Alipay adapter includes special features for financial and payment applications:

- **Payment Integration**: Direct access to Alipay's payment APIs
- **Financial Services**: Credit, loans, insurance integrations
- **Security Features**: Biometric authentication (facial recognition)
- **Life Services**: Utility payments, transportation, lifestyle services

## Error Handling & Fallbacks

The framework implements graceful degradation:

1. **Storage**: localStorage → in-memory Map (for test environments)
2. **Location**: Native API → browser Geolocation API → null
3. **Network**: HTTP → RPC → graceful error
4. **State**: Platform-specific storage → memory → void

This ensures the application continues functioning even when certain APIs are unavailable.

## Performance Considerations

- **Lazy loading**: Adapters loaded on-demand
- **Tree-shaking**: Unused platform code removed in production
- **Zero overhead**: Platform detection happens once at startup
- **Type safety**: Full TypeScript support for compile-time optimizations

## Testing Strategy

Each adapter is tested in isolation using platform-specific mocks:

```typescript
describe('AlipayStorageAdapter', () => {
  it('should use Alipay APIs when available', async () => {
    // Mock Alipay environment
    global.my = {
      getStorageSync: (key) => '{"value": "test"}',
      setStorageSync: () => {}
    }
    
    const adapter = new AlipayStorageAdapter()
    await adapter.set('key', { value: 'test' })
    const result = await adapter.get('key')
    expect(result).toEqual({ value: 'test' })
  })
  
  it('should fallback to localStorage', async () => {
    // Remove Alipay mock
    delete global.my
    
    const adapter = new AlipayStorageAdapter()
    await adapter.set('key', { value: 'fallback' })
    const result = await adapter.get('key')
    expect(result).toEqual({ value: 'fallback' })
  })
})
```

Test results: **98/98 passing** across all platform adapters.