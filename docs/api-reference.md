# API Reference

## Core Hooks

### usePlatform()

Returns information about the current platform.

```typescript
import { usePlatform } from 'uniadapter'

const platform = usePlatform()
// {
//   name: 'weapp' | 'douyin' | 'h5' | ...
//   type: 'mini-program' | 'web' | 'app' | 'distributed'
//   isWeb: boolean
//   isMiniProgram: boolean
//   isApp: boolean
//   isMobile: boolean
// }
```

### useUniState(initialValue)

Cross-platform state management hook.

```typescript
const [value, setValue] = useUniState(initialState)
setValue(newValue)
setValue(prev => prev + 1)  // Also supports updater function
```

### useUniRouter()

Navigation API with platform-specific implementations.

```typescript
const router = useUniRouter()

router.push('/path')              // Navigate to path
router.replace('/path')           // Replace history
router.goBack()                   // Go back to previous page
```

### useUniRequest()

HTTP request API for all platforms.

```typescript
const request = useUniRequest()

await request.get(url, options)
await request.post(url, data, options)
await request.put(url, data, options)
await request.del(url, options)
```

**Options:**
```typescript
interface RequestOptions {
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
  data?: any
}
```

### usePlatform()

Get platform information.

```typescript
const { name, type, isWeb, isMiniProgram, isApp, isMobile } = usePlatform()
```

## Platform Detection

### detectPlatform()

Manually detect the current platform.

```typescript
import { detectPlatform, Platform } from 'uniadapter'

const platform = detectPlatform()

switch (platform) {
  case Platform.H5:
    // Browser
    break
  case Platform.WEAPP:
    // WeChat Mini Program
    break
  case Platform.GO_DISTRIBUTED:
    // Go Distributed System
    break
}
```

**Supported Platforms:**
- `Platform.H5` - Web/Browser
- `Platform.WEAPP` - WeChat Mini Program
- `Platform.DOUYIN_MINIPROGRAM` - Douyin
- `Platform.XIAOHONGSHU` - Xiaohongshu
- `Platform.GAODE_MAP` - Gaode Map
- `Platform.REACT_NATIVE` - React Native
- `Platform.GO_DISTRIBUTED` - Go Distributed
- `Platform.HARMONYOS` - HarmonyOS
- `Platform.UNKNOWN` - Unknown

## Adapter Types

### StorageAdapter

```typescript
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}
```

### CryptoAdapter

```typescript
interface CryptoAdapter {
  generateKey(): Promise<void>
  encrypt(data: string): Promise<string>
  decrypt(encrypted: string): Promise<string>
  hash(data: string): Promise<string>
}
```

### FileAdapter

```typescript
interface FileAdapter {
  selectImage(): Promise<{ path: string; base64: string }>
  uploadFile(path: string, url: string): Promise<boolean>
  compressImage(path: string): Promise<{ path: string; size: number }>
}
```

## Type Definitions

### PlatformInfo

```typescript
interface PlatformInfo {
  name: string
  type: 'web' | 'mini-program' | 'app' | 'distributed'
  isWeb: boolean
  isMiniProgram: boolean
  isApp: boolean
  isMobile: boolean
}
```

### RequestOptions

```typescript
interface RequestOptions {
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
  data?: any
}
```

## Examples

### Simple State Counter

```typescript
import React from 'react'
import { useUniState } from 'uniadapter'

export function Counter() {
  const [count, setCount] = useUniState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  )
}
```

### Platform-Specific Rendering

```typescript
import React from 'react'
import { usePlatform } from 'uniadapter'

export function App() {
  const platform = usePlatform()
  
  if (platform.isMiniProgram) {
    return <MiniProgramLayout />
  }
  
  return <WebLayout />
}
```

### Data Fetching

```typescript
import React from 'react'
import { useUniRequest } from 'uniadapter'

export function UserList() {
  const request = useUniRequest()
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  
  React.useEffect(() => {
    setLoading(true)
    request.get('/api/users')
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Navigation

```typescript
import React from 'react'
import { useUniRouter } from 'uniadapter'

export function Navigation() {
  const router = useUniRouter()
  
  return (
    <nav>
      <button onClick={() => router.push('/home')}>Home</button>
      <button onClick={() => router.push('/profile')}>Profile</button>
      <button onClick={() => router.goBack()}>Back</button>
    </nav>
  )
}
```
