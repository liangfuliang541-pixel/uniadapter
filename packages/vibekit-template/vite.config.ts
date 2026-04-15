import { defineConfig } from '@uniadapter/vibe-engine/config'

export default defineConfig({
  project: 'my-vibe-app',
  platform: 'weapp', // weapp | alipay | douyin | h5
  ai: {
    provider: 'openrouter',
    model: 'anthropic/claude-3.5-sonnet',
    apiKey: process.env.OPENROUTER_API_KEY || ''
  },
  vibe: {
    theme: 'modern',
    tailwind: true,
    components: ['button', 'card', 'dialog', 'toast']
  }
})
