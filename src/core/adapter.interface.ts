/**
 * 平台适配器接口定义
 */

export interface PlatformConfig {
  platform: string;
  features: {
    storage: boolean;
    network: boolean;
    geolocation: boolean;
    camera: boolean;
    microphone: boolean;
    notifications: boolean;
    clipboard: boolean;
    fileSystem: boolean;
    biometrics: boolean;
  };
  capabilities: {
    touch: boolean;
    webGL: boolean;
    webAssembly: boolean;
    serviceWorker: boolean;
    pushNotifications: boolean;
  };
}

export interface PlatformAdapter {
  platform: string;
  detect(): boolean;
  getConfig(): PlatformConfig;
  initialize(): Promise<void>;
}