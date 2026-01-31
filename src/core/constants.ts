/**
 * ============================================
 * 心迹 XinJi - 应用常量配置
 * ============================================
 * 
 * 定义应用中使用的所有常量配置
 * 包括心情配置、情绪因素、应用参数等
 */

import type { MoodConfig, MoodType, EmotionFactor, FactorCategory } from './types'

// ==================== 心情配置 ====================

/**
 * 心情配置映射表
 * 定义每种心情的表情、标签、颜色和分数
 */
export const MOOD_CONFIG: Record<MoodType, MoodConfig> = {
  great: {
    type: 'great',
    emoji: '😄',
    label: '很棒',
    color: 'mood-great',
    score: 5,
  },
  good: {
    type: 'good',
    emoji: '😊',
    label: '不错',
    color: 'mood-good',
    score: 4,
  },
  okay: {
    type: 'okay',
    emoji: '😐',
    label: '一般',
    color: 'mood-okay',
    score: 3,
  },
  bad: {
    type: 'bad',
    emoji: '😔',
    label: '不好',
    color: 'mood-bad',
    score: 2,
  },
  awful: {
    type: 'awful',
    emoji: '😢',
    label: '很差',
    color: 'mood-awful',
    score: 1,
  },
}

/**
 * 心情类型数组 (按从好到差排序)
 */
export const MOOD_TYPES: MoodType[] = ['great', 'good', 'okay', 'bad', 'awful']

// ==================== 情绪因素配置 ====================

/**
 * 因素分类配置
 */
export const FACTOR_CATEGORIES: Record<FactorCategory, { label: string; icon: string }> = {
  work: { label: '工作', icon: '💼' },
  health: { label: '健康', icon: '🏃' },
  social: { label: '社交', icon: '👥' },
  hobby: { label: '爱好', icon: '🎮' },
  family: { label: '家庭', icon: '🏠' },
  finance: { label: '财务', icon: '💰' },
  other: { label: '其他', icon: '📝' },
}

/**
 * 预设情绪因素列表
 * 用户可以选择这些因素来标记影响心情的事件
 */
export const DEFAULT_FACTORS: EmotionFactor[] = [
  // ===== 工作相关 =====
  { id: 'f1', name: '工作顺利', icon: '✅', category: 'work', impact: 'positive' },
  { id: 'f2', name: '工作压力', icon: '😰', category: 'work', impact: 'negative' },
  { id: 'f3', name: '完成任务', icon: '🎯', category: 'work', impact: 'positive' },
  { id: 'f4', name: '开会', icon: '📊', category: 'work', impact: 'neutral' },
  
  // ===== 健康相关 =====
  { id: 'f5', name: '运动', icon: '🏃', category: 'health', impact: 'positive' },
  { id: 'f6', name: '睡眠充足', icon: '😴', category: 'health', impact: 'positive' },
  { id: 'f7', name: '身体不适', icon: '🤒', category: 'health', impact: 'negative' },
  { id: 'f8', name: '健康饮食', icon: '🥗', category: 'health', impact: 'positive' },
  
  // ===== 社交相关 =====
  { id: 'f9', name: '朋友聚会', icon: '🎉', category: 'social', impact: 'positive' },
  { id: 'f10', name: '独处', icon: '🧘', category: 'social', impact: 'neutral' },
  { id: 'f11', name: '社交疲惫', icon: '😮‍💨', category: 'social', impact: 'negative' },
  { id: 'f12', name: '约会', icon: '💕', category: 'social', impact: 'positive' },
  
  // ===== 爱好相关 =====
  { id: 'f13', name: '阅读', icon: '📚', category: 'hobby', impact: 'positive' },
  { id: 'f14', name: '游戏', icon: '🎮', category: 'hobby', impact: 'positive' },
  { id: 'f15', name: '音乐', icon: '🎵', category: 'hobby', impact: 'positive' },
  { id: 'f16', name: '旅行', icon: '✈️', category: 'hobby', impact: 'positive' },
  
  // ===== 家庭相关 =====
  { id: 'f17', name: '家人团聚', icon: '👨‍👩‍👧', category: 'family', impact: 'positive' },
  { id: 'f18', name: '家务', icon: '🧹', category: 'family', impact: 'neutral' },
  { id: 'f19', name: '宠物', icon: '🐾', category: 'family', impact: 'positive' },
  { id: 'f20', name: '家庭争吵', icon: '😤', category: 'family', impact: 'negative' },
  
  // ===== 财务相关 =====
  { id: 'f21', name: '发工资', icon: '💵', category: 'finance', impact: 'positive' },
  { id: 'f22', name: '购物', icon: '🛒', category: 'finance', impact: 'neutral' },
  { id: 'f23', name: '财务压力', icon: '💸', category: 'finance', impact: 'negative' },
  
  // ===== 其他 =====
  { id: 'f24', name: '天气好', icon: '☀️', category: 'other', impact: 'positive' },
  { id: 'f25', name: '下雨', icon: '🌧️', category: 'other', impact: 'neutral' },
  { id: 'f26', name: '学习', icon: '📖', category: 'other', impact: 'positive' },
]

// ==================== 应用配置 ====================

/**
 * 应用全局配置
 */
export const APP_CONFIG = {
  // 应用信息
  name: '心迹',
  version: '1.0.0',
  description: '记录每一天的心情，发现情绪的规律',
  
  // 本地存储键名
  storageKeys: {
    entries: 'xinj_entries',      // 日记数据
    settings: 'xinj_settings',    // 用户设置
    factors: 'xinj_factors',      // 自定义因素
    lastSync: 'xinj_last_sync',   // 最后同步时间
  },
  
  // 功能限制配置
  limits: {
    maxPhotosPerEntry: 9,         // 每条记录最多照片数
    maxPhotoSize: 5 * 1024 * 1024, // 照片最大5MB
    maxContentLength: 10000,       // 内容最大字符数
    maxTagsPerEntry: 10,           // 最多标签数
    maxFactorsPerEntry: 5,         // 最多因素数
  },
  
  // 默认用户设置
  defaultSettings: {
    theme: 'system' as const,
    language: 'zh-CN' as const,
    reminderEnabled: false,
    reminderTime: '21:00',
    encryptionEnabled: false,
    biometricEnabled: false,
    syncEnabled: false,
    exportFormat: 'json' as const,
  },
}

// ==================== 日期格式配置 ====================

/**
 * 日期格式化模板
 * 使用date-fns库进行格式化
 */
export const DATE_FORMATS = {
  display: 'M月d日',              // 简短显示: 1月1日
  displayFull: 'yyyy年M月d日',    // 完整显示: 2024年1月1日
  displayWithWeek: 'M月d日 EEEE', // 带星期: 1月1日 星期一
  storage: 'yyyy-MM-dd',          // 存储格式: 2024-01-01
  time: 'HH:mm',                  // 时间格式: 14:30
  datetime: 'yyyy-MM-dd HH:mm',   // 日期时间: 2024-01-01 14:30
}

// ==================== 动画配置 ====================

/**
 * 动画时长和缓动函数配置
 */
export const ANIMATION_CONFIG = {
  // 动画时长 (毫秒)
  duration: {
    fast: 150,    // 快速动画
    normal: 300,  // 普通动画
    slow: 500,    // 慢速动画
  },
  // 缓动函数
  easing: {
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',     // 减速
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',        // 加速
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',   // 先加速后减速
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // 弹性效果
  },
}
