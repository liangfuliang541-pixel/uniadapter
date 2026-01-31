/**
 * UniAdapter 核心适配器类
 * 统一处理多端平台差异
 */

export interface PlatformAdapter {
  /** 平台名称 */
  name: string;
  /** 检测当前环境是否为此平台 */
  detect: () => boolean;
  /** 平台特定的API映射 */
  api: any;
  /** 平台特定的组件适配 */
  components: Record<string, any>;
  /** 平台特定的样式处理 */
  style: {
    /** 转换样式对象为平台特定格式 */
    transform: (styles: Record<string, any>) => any;
    /** 处理单位转换 */
    unit: (value: string | number) => string;
  };
}

export class UniAdapter {
  private static instance: UniAdapter;
  private adapters: PlatformAdapter[] = [];
  private currentAdapter: PlatformAdapter | null = null;

  private constructor() {
    this.initAdapters();
    this.detectPlatform();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): UniAdapter {
    if (!UniAdapter.instance) {
      UniAdapter.instance = new UniAdapter();
    }
    return UniAdapter.instance;
  }

  /**
   * 初始化所有平台适配器
   */
  private initAdapters() {
    // 注册各平台适配器
    this.adapters = [
      this.createWebAdapter(),
      this.createWeappAdapter(),
      this.createAppAdapter(),
      this.createH5Adapter()
    ];
  }

  /**
   * 检测当前运行平台
   */
  private detectPlatform() {
    for (const adapter of this.adapters) {
      if (adapter.detect()) {
        this.currentAdapter = adapter;
        console.log(`[UniAdapter] 检测到平台: ${adapter.name}`);
        return;
      }
    }
    // 默认使用Web适配器
    this.currentAdapter = this.adapters[0];
    console.warn('[UniAdapter] 未检测到明确平台，使用默认Web适配器');
  }

  /**
   * 创建Web平台适配器
   */
  private createWebAdapter(): PlatformAdapter {
    return {
      name: 'web',
      detect: () => typeof window !== 'undefined' && !this.isMiniProgram(),
      api: {
        // 网络请求
        request: (options: any) => fetch(options.url, options),
        // 本地存储
        storage: {
          set: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
          get: (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
          },
          remove: (key: string) => localStorage.removeItem(key)
        },
        // 路由
        navigate: {
          push: (url: string) => window.history.pushState({}, '', url),
          replace: (url: string) => window.history.replaceState({}, '', url)
        }
      },
      components: {
        // Web特定组件映射
        View: 'div',
        Text: 'span',
        Image: 'img',
        Button: 'button'
      },
      style: {
        transform: (styles) => styles,
        unit: (value) => typeof value === 'number' ? `${value}px` : value
      }
    };
  }

  /**
   * 创建小程序平台适配器
   */
  private createWeappAdapter(): PlatformAdapter {
    return {
      name: 'weapp',
      detect: () => this.isMiniProgram(),
      api: {
        request: (options: any) => (globalThis as any).wx.request(options),
        storage: {
          set: (key: string, value: any) => (globalThis as any).wx.setStorageSync(key, value),
          get: (key: string) => (globalThis as any).wx.getStorageSync(key),
          remove: (key: string) => (globalThis as any).wx.removeStorageSync(key)
        },
        navigate: {
          push: (url: string) => (globalThis as any).wx.navigateTo({ url }),
          replace: (url: string) => (globalThis as any).wx.redirectTo({ url })
        }
      },
      components: {
        View: 'view',
        Text: 'text',
        Image: 'image',
        Button: 'button'
      },
      style: {
        transform: (styles) => this.convertStylesToWeapp(styles),
        unit: (value) => typeof value === 'number' ? `${value}rpx` : value
      }
    };
  }

  /**
   * 创建原生APP适配器
   */
  private createAppAdapter(): PlatformAdapter {
    return {
      name: 'app',
      detect: () => typeof (globalThis as any).plus !== 'undefined',
      api: {
        request: (options: any) => (globalThis as any).plus.net.request(options),
        storage: {
          set: (key: string, value: any) => (globalThis as any).plus.storage.setItem(key, JSON.stringify(value)),
          get: (key: string) => {
            const item = (globalThis as any).plus.storage.getItem(key);
            return item ? JSON.parse(item) : null;
          },
          remove: (key: string) => (globalThis as any).plus.storage.removeItem(key)
        },
        navigate: {
          push: (url: string) => (globalThis as any).plus.webview.create(url),
          replace: (url: string) => {
            const current = (globalThis as any).plus.webview.currentWebview();
            (globalThis as any).plus.webview.create(url, current.id);
          }
        }
      },
      components: {
        View: 'div',
        Text: 'span',
        Image: 'img',
        Button: 'button'
      },
      style: {
        transform: (styles) => this.convertStylesToApp(styles),
        unit: (value) => typeof value === 'number' ? `${value}px` : value
      }
    };
  }

  /**
   * 创建H5适配器
   */
  private createH5Adapter(): PlatformAdapter {
    return {
      name: 'h5',
      detect: () => this.isH5Environment(),
      api: {
        request: (options: any) => fetch(options.url, options),
        storage: {
          set: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
          get: (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
          },
          remove: (key: string) => localStorage.removeItem(key)
        },
        navigate: {
          push: (url: string) => window.location.href = url,
          replace: (url: string) => window.location.replace(url)
        }
      },
      components: {
        View: 'div',
        Text: 'span',
        Image: 'img',
        Button: 'button'
      },
      style: {
        transform: (styles) => this.convertStylesToH5(styles),
        unit: (value) => typeof value === 'number' ? `${value * 2}rpx` : value
      }
    };
  }

  /**
   * 判断是否为小程序环境
   */
  private isMiniProgram(): boolean {
    return typeof (globalThis as any).wx !== 'undefined' || 
           typeof (globalThis as any).my !== 'undefined' || 
           typeof (globalThis as any).tt !== 'undefined' ||
           typeof (globalThis as any).swan !== 'undefined';
  }

  /**
   * 判断是否为H5环境
   */
  private isH5Environment(): boolean {
    return typeof window !== 'undefined' && 
           window.location && 
           window.location.protocol.startsWith('http');
  }

  /**
   * 转换样式为小程序格式
   */
  private convertStylesToWeapp(styles: Record<string, any>): string {
    return Object.entries(styles)
      .map(([key, value]) => `${this.camelToKebab(key)}: ${this.currentAdapter?.style.unit(value)}`)
      .join('; ');
  }

  /**
  * 转换样式为APP格式
  */
  private convertStylesToApp(styles: Record<string, any>): Record<string, any> {
    const converted: Record<string, any> = {};
    Object.entries(styles).forEach(([key, value]) => {
      converted[this.camelToKebab(key)] = this.currentAdapter?.style.unit(value);
    });
    return converted;
  }

  /**
   * 转换样式为H5格式
   */
  private convertStylesToH5(styles: Record<string, any>): Record<string, any> {
    const converted: Record<string, any> = {};
    Object.entries(styles).forEach(([key, value]) => {
      converted[key] = this.currentAdapter?.style.unit(value);
    });
    return converted;
  }

  /**
   * 驼峰转短横线
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * 获取当前平台适配器
   */
  getCurrentAdapter(): PlatformAdapter | null {
    return this.currentAdapter;
  }

  /**
   * 获取平台API
   */
  getAPI(): Record<string, Function> {
    return this.currentAdapter?.api || {};
  }

  /**
   * 获取平台组件映射
   */
  getComponents(): Record<string, any> {
    return this.currentAdapter?.components || {};
  }

  /**
   * 转换样式
   */
  transformStyles(styles: Record<string, any>): any {
    return this.currentAdapter?.style.transform(styles);
  }
}