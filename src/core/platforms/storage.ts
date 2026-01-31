/**
 * 简单的存储适配器
 * 为不同平台提供统一的存储API
 */

export function storage() {
  return {
    get: async <T>(key: string): Promise<T | null> => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error getting item from storage: ${key}`, error);
        return null;
      }
    },
    
    set: async (key: string, value: any): Promise<void> => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting item to storage: ${key}`, error);
      }
    },
    
    remove: async (key: string): Promise<void> => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing item from storage: ${key}`, error);
      }
    }
  };
}