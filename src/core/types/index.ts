/**
 * ============================================
 * 心迹 XinJi - 类型定义文件
 * ============================================
 * 
 * 定义应用中使用的所有TypeScript类型
 * 这些类型是平台无关的，可以在H5、小程序、APP中复用
 */

// ==================== 心情相关类型 ====================

/**
 * 心情类型枚举
 * great: 很棒 😄
 * good: 不错 😊
 * okay: 一般 😐
 * bad: 不好 😔
 * awful: 很差 😢
 */
export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'awful'

/**
 * 心情分数 (1-5分)
 */
export type MoodScore = 1 | 2 | 3 | 4 | 5

/**
 * 心情配置接口
 */
export interface MoodConfig {
  type: MoodType       // 心情类型
  emoji: string        // 表情符号
  label: string        // 中文标签
  color: string        // CSS颜色类名
  score: MoodScore     // 对应分数
}

// ==================== 日记相关类型 ====================

/**
 * 日记条目接口
 * 这是核心数据结构，存储每一条心情记录
 */
export interface JournalEntry {
  id: string              // 唯一标识符 (UUID)
  date: string            // 日期 (YYYY-MM-DD格式)
  mood: MoodType          // 心情类型
  moodScore: MoodScore    // 心情分数
  title?: string          // 标题 (可选)
  content: string         // 富文本HTML内容
  plainText: string       // 纯文本内容 (用于搜索)
  tags: string[]          // 标签列表
  photos: PhotoAttachment[] // 照片附件
  weather?: WeatherInfo   // 天气信息 (可选)
  location?: LocationInfo // 位置信息 (可选)
  factors: EmotionFactor[] // 情绪影响因素
  isEncrypted: boolean    // 是否加密
  createdAt: number       // 创建时间戳
  updatedAt: number       // 更新时间戳
}

/**
 * 照片附件接口
 */
export interface PhotoAttachment {
  id: string          // 照片ID
  url: string         // 原图URL
  thumbnail: string   // 缩略图URL
  caption?: string    // 图片描述
  createdAt: number   // 添加时间
}

/**
 * 天气信息接口
 */
export interface WeatherInfo {
  condition: string   // 天气状况 (晴、阴、雨等)
  temperature: number // 温度
  icon: string        // 天气图标
}

/**
 * 位置信息接口
 */
export interface LocationInfo {
  name: string        // 位置名称
  latitude?: number   // 纬度
  longitude?: number  // 经度
}

// ==================== 情绪因素类型 ====================

/**
 * 情绪因素接口
 * 用于记录影响心情的因素
 */
export interface EmotionFactor {
  id: string                // 因素ID
  name: string              // 因素名称
  icon: string              // 图标
  category: FactorCategory  // 所属分类
  impact: 'positive' | 'negative' | 'neutral'  // 影响类型
}

/**
 * 因素分类
 */
export type FactorCategory = 'work' | 'health' | 'social' | 'hobby' | 'family' | 'finance' | 'other'

// ==================== 统计分析类型 ====================

/**
 * 心情统计数据接口
 */
export interface MoodStats {
  totalEntries: number                    // 总记录数
  avgScore: number                        // 平均心情分数
  streak: number                          // 当前连续记录天数
  longestStreak: number                   // 最长连续记录天数
  moodDistribution: Record<MoodType, number>  // 心情分布
  factorCorrelation: FactorCorrelation[]  // 因素关联分析
  weekdayPattern: WeekdayPattern[]        // 星期模式
  monthlyTrend: MonthlyTrend[]            // 月度趋势
}

/**
 * 因素关联分析
 */
export interface FactorCorrelation {
  factor: EmotionFactor  // 因素
  avgMoodScore: number   // 平均心情分数
  occurrences: number    // 出现次数
  impact: number         // 影响程度 (-1 到 1)
}

/**
 * 星期模式分析
 */
export interface WeekdayPattern {
  day: number      // 星期几 (0-6, 0为周日)
  avgScore: number // 平均分数
  count: number    // 记录数量
}

/**
 * 月度趋势分析
 */
export interface MonthlyTrend {
  year: number       // 年份
  month: number      // 月份 (0-11)
  avgScore: number   // 平均分数
  count: number      // 记录数量
  bestDay?: string   // 心情最好的一天
  worstDay?: string  // 心情最差的一天
}

// ==================== 用户设置类型 ====================

/**
 * 用户设置接口
 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'  // 主题设置
  language: 'zh-CN' | 'en-US'         // 语言设置
  reminderEnabled: boolean             // 是否开启提醒
  reminderTime: string                 // 提醒时间 (HH:mm)
  encryptionEnabled: boolean           // 是否开启加密
  biometricEnabled: boolean            // 是否开启生物识别
  syncEnabled: boolean                 // 是否开启同步
  exportFormat: 'json' | 'pdf' | 'markdown'  // 导出格式
}

// ==================== 情绪分析类型 ====================

/**
 * 情绪标签接口
 */
export interface EmotionTag {
  id: string
  name: string
  confidence: number
  source: 'analysis' | 'manual'
}



// ==================== API响应类型 ====================

/**
 * API响应通用接口
 */
export interface ApiResponse<T> {
  success: boolean  // 是否成功
  data?: T          // 响应数据
  error?: {
    code: string    // 错误码
    message: string // 错误信息
  }
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T> {
  items: T[]        // 数据列表
  total: number     // 总数量
  page: number      // 当前页码
  pageSize: number  // 每页数量
  hasMore: boolean  // 是否有更多
}
