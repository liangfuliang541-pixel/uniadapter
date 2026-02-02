import type { PlatformAdapter, PlatformConfig } from '../adapter.interface'

export class NextJsPlatformAdapter implements PlatformAdapter {
  platform = 'nextjs'

  detect(): boolean {
    try {
      return typeof (globalThis as any).__NEXT_DATA__ !== 'undefined'
    } catch (e) {
      return false
    }
  }

  getConfig(): PlatformConfig {
    return {
      platform: this.platform,
      features: {
        storage: true,
        network: true,
        geolocation: true,
        camera: false,
        microphone: false,
        notifications: true,
        clipboard: true,
        fileSystem: true,
        biometrics: false
      },
      capabilities: {
        touch: true,
        webGL: true,
        webAssembly: true,
        serviceWorker: true,
        pushNotifications: true
      }
    }
  }

  async initialize(): Promise<void> {
    // Next.js-specific initialization can go here (e.g., SSR-aware hooks)
    return Promise.resolve()
  }
}
