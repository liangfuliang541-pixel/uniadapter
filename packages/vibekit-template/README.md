# VibeKit Template

> Vibe-first Cross-Platform Mini-Program Starter

```bash
# Create your VibeKit project in one command
npx create-vibekit my-app

# Or use degit
npx degit liangfuliang541-pixel/uniadapter/packages/vibekit-template my-app

cd my-app
npm install
npm run dev:weapp
```

## What's Inside

| Package | Version | Purpose |
|---------|---------|---------|
| @liangfu/uniadapter | ^2.0.0 | VibeEngine + VibeUI |
| @tarojs/taro | ^3.6.35 | Cross-platform framework |
| React | ^18.2.0 | UI library |

## VibeKit Features

### 🌀 AI Vibe Generator
```typescript
import { useVibeGenerate } from '@liangfu/uniadapter'

const { generate } = useVibeGenerate()
const code = await generate('做一个商品详情页，含轮播和购买按钮', { platform: 'weapp' })
```

### 📦 VibeUI Components
```typescript
import { Button, Card, Dialog, Toast } from '@liangfu/uniadapter'

// Register once, use everywhere
<Card title="VibeUI">
  <Button type="primary">Hello VibeKit!</Button>
</Card>
```

### 🔄 Platform Switching
```bash
npm run dev:weapp   # WeChat Mini-Program
npm run dev:h5      # H5 / Mobile Web
npm run dev:alipay  # Alipay Mini-Program
```

## Get Started

1. Get your API key from [OpenRouter](https://openrouter.ai/keys)
2. Create `.env` file:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-...
   ```
3. Run:
   ```bash
   npm install
   npm run dev:weapp
   ```

## License

MIT
