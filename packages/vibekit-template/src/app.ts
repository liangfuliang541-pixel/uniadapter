import { UniAdapterProvider } from '@liangfu/uniadapter'
import { VibeEngine } from '@liangfu/uniadapter/vibe-engine'
import { VibeStudio } from '@liangfu/uniadapter/vibe-engine/studio'
import { ComponentType } from 'react'
import './app.scss'

// Initialize VibeEngine
const vibeEngine = new VibeEngine({
  platform: 'weapp',
  ai: {
    provider: 'openrouter',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || ''
  }
})

// VibeUI component registry - add components with one line
const { registerComponent, Button, Card, Dialog, Toast } = vibeEngine.ui

// Register VibeUI components
registerComponent('button', Button)
registerComponent('card', Card)
registerComponent('dialog', Dialog)
registerComponent('toast', Toast)

export { vibeEngine, Button, Card, Dialog, Toast, VibeStudio }

export function App({ children }: { children: ComponentType }) {
  return (
    <UniAdapterProvider engine={vibeEngine}>
      {children({})}
    </UniAdapterProvider>
  )
}
