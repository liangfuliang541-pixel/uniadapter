// 测试工具函数
import { cleanup } from '@testing-library/react'

// 模拟 DOM API（如果需要）
global.matchMedia = global.matchMedia || ((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))