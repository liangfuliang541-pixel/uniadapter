# UniAdapter Documentation

See the main [README.md](../README.md) for the complete documentation.

## Quick Reference

### npm

```bash
npm install @liangfu/uniadapter
```

### Platform Detection

```typescript
import { detectPlatform, Platform } from '@liangfu/uniadapter'
const platform = detectPlatform()
```

### Storage

```typescript
import { useUniStorage } from '@liangfu/uniadapter'
const storage = useUniStorage()
await storage.set('key', 'value')
const value = await storage.get('key')
```

### HTTP Request

```typescript
import { useUniRequest } from '@liangfu/uniadapter'
const { get, post } = useUniRequest()
const data = await get('/api/users')
```

### AI Code Generation (VibeEngine)

```typescript
import { VibeEngine } from '@liangfu/uniadapter'
const engine = new VibeEngine({ platform: 'weapp' })
const result = await engine.generate({ prompt: '用户登录', apiKey: '...' })
console.log(result.code)
```

## Supported Platforms

| Platform | Key API |
|----------|---------|
| H5 / Web | localStorage, fetch |
| WeChat | wx.getStorage, wx.request |
| Douyin | tt.getStorage, tt.request |
| Xiaohongshu | xhs.* |
| AMap | AMap.* |

## API Reference

Full API docs: [api-reference.md](./api-reference.md)
