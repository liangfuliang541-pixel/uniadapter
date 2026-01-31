/**
 * 情绪语录库 - 根据心情推荐治愈语录
 */

import type { MoodType } from './types'

export interface Quote {
  text: string
  author?: string
}

export const MOOD_QUOTES: Record<MoodType, Quote[]> = {
  great: [
    { text: '今天的快乐值得被铭记，愿这份美好延续到明天。', author: '心迹' },
    { text: '幸福不是拥有很多，而是珍惜眼前的每一刻。' },
    { text: '你的笑容是世界上最美的风景。' },
    { text: '好心情是会传染的，今天你一定温暖了很多人。' },
    { text: '生活中最珍贵的，往往是这些简单的快乐时刻。' },
    { text: '阳光正好，微风不燥，你也刚刚好。' },
  ],
  good: [
    { text: '平淡的日子里藏着小确幸，你发现了。', author: '心迹' },
    { text: '生活不必太用力，慢慢来会比较快。' },
    { text: '今天的你，比昨天更接近想要的生活。' },
    { text: '保持这份从容，好事正在路上。' },
    { text: '不急不躁，生活自会给你答案。' },
    { text: '每一个平凡的日子，都在默默积累力量。' },
  ],
  okay: [
    { text: '平静也是一种力量，不是所有日子都需要波澜壮阔。', author: '心迹' },
    { text: '今天可以只是今天，不必承载太多期待。' },
    { text: '允许自己有普通的一天，这很正常。' },
    { text: '即使是灰色的天空，也有它独特的美。' },
    { text: '休息不是停滞，而是为了更好地出发。' },
    { text: '平淡是生活的常态，珍贵的是你在记录它。' },
  ],
  bad: [
    { text: '今天辛苦了，允许自己难过一会儿。', author: '心迹' },
    { text: '没关系，明天又是新的一天。' },
    { text: '乌云终会散去，阳光总在风雨后。' },
    { text: '你比自己想象的更坚强。' },
    { text: '低谷是为了蓄力，你正在变得更好。' },
    { text: '记录下来，是因为这些情绪也值得被看见。' },
  ],
  awful: [
    { text: '再难的日子也会过去，请相信时间的力量。', author: '心迹' },
    { text: '你不必假装坚强，脆弱也是勇敢的一种。' },
    { text: '今天的泪水，是明天微笑的伏笔。' },
    { text: '允许自己崩溃，然后重新站起来。' },
    { text: '黑夜再长，黎明总会到来。' },
    { text: '你已经很努力了，对自己温柔一点。' },
  ],
}

/**
 * 获取随机语录
 */
export function getRandomQuote(mood: MoodType): Quote {
  const quotes = MOOD_QUOTES[mood]
  return quotes[Math.floor(Math.random() * quotes.length)]
}

/**
 * 写作引导提示 - 帮助用户表达情绪
 */
export const WRITING_PROMPTS: Record<MoodType, string[]> = {
  great: [
    '是什么让今天如此美好？',
    '今天最让你开心的瞬间是什么？',
    '有没有想要感谢的人或事？',
    '这份快乐来自哪里？',
    '如果要用一个画面描述今天，会是什么样的？',
  ],
  good: [
    '今天有什么小确幸吗？',
    '是什么让你感到满足？',
    '今天学到了什么新东西？',
    '有没有什么值得记住的细节？',
    '此刻的心情像什么颜色？',
  ],
  okay: [
    '今天是怎样度过的？',
    '有什么想说但没说出口的话？',
    '现在最想做的事情是什么？',
    '如果能重来，今天会有什么不同？',
    '此刻脑海里在想什么？',
  ],
  bad: [
    '是什么让你感到不开心？',
    '有什么话想对自己说？',
    '需要什么才能让心情好起来？',
    '有没有可以倾诉的人？',
    '明天希望会有什么不同？',
  ],
  awful: [
    '发生了什么事情？',
    '你现在最需要的是什么？',
    '有什么是你可以控制的？',
    '写下此刻的感受，不用在意文字...',
    '如果能对自己说一句话，会是什么？',
  ],
}

/**
 * 获取随机写作提示
 */
export function getRandomPrompt(mood: MoodType): string {
  const prompts = WRITING_PROMPTS[mood]
  return prompts[Math.floor(Math.random() * prompts.length)]
}

/**
 * 成就徽章定义
 */
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: AchievementStats) => boolean
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface AchievementStats {
  totalEntries: number
  streak: number
  longestStreak: number
  moodCounts: Record<MoodType, number>
  daysWithPhotos: number
  daysWithFactors: number
  firstEntryDate?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  // 记录里程碑
  {
    id: 'first_entry',
    name: '初心',
    description: '完成第一次心情记录',
    icon: '🌱',
    condition: (s) => s.totalEntries >= 1,
    tier: 'bronze',
  },
  {
    id: 'entries_7',
    name: '萌芽',
    description: '累计记录7天',
    icon: '🌿',
    condition: (s) => s.totalEntries >= 7,
    tier: 'bronze',
  },
  {
    id: 'entries_30',
    name: '成长',
    description: '累计记录30天',
    icon: '🌳',
    condition: (s) => s.totalEntries >= 30,
    tier: 'silver',
  },
  {
    id: 'entries_100',
    name: '繁茂',
    description: '累计记录100天',
    icon: '🌲',
    condition: (s) => s.totalEntries >= 100,
    tier: 'gold',
  },
  {
    id: 'entries_365',
    name: '常青',
    description: '累计记录365天',
    icon: '🏔️',
    condition: (s) => s.totalEntries >= 365,
    tier: 'platinum',
  },
  
  // 连续记录
  {
    id: 'streak_3',
    name: '起步',
    description: '连续记录3天',
    icon: '🔥',
    condition: (s) => s.streak >= 3 || s.longestStreak >= 3,
    tier: 'bronze',
  },
  {
    id: 'streak_7',
    name: '坚持',
    description: '连续记录7天',
    icon: '⭐',
    condition: (s) => s.streak >= 7 || s.longestStreak >= 7,
    tier: 'silver',
  },
  {
    id: 'streak_30',
    name: '自律',
    description: '连续记录30天',
    icon: '🏆',
    condition: (s) => s.streak >= 30 || s.longestStreak >= 30,
    tier: 'gold',
  },
  {
    id: 'streak_100',
    name: '传奇',
    description: '连续记录100天',
    icon: '👑',
    condition: (s) => s.streak >= 100 || s.longestStreak >= 100,
    tier: 'platinum',
  },
  
  // 情绪相关
  {
    id: 'mood_great_10',
    name: '快乐收集者',
    description: '记录10次"很棒"的心情',
    icon: '😄',
    condition: (s) => s.moodCounts.great >= 10,
    tier: 'silver',
  },
  {
    id: 'mood_variety',
    name: '情绪丰富',
    description: '记录过所有5种心情',
    icon: '🎭',
    condition: (s) => Object.values(s.moodCounts).every(c => c > 0),
    tier: 'bronze',
  },
  
  // 功能使用
  {
    id: 'photos_10',
    name: '生活记录者',
    description: '10天的记录包含照片',
    icon: '📸',
    condition: (s) => s.daysWithPhotos >= 10,
    tier: 'silver',
  },
  {
    id: 'factors_20',
    name: '洞察者',
    description: '20天的记录包含情绪因素',
    icon: '🔍',
    condition: (s) => s.daysWithFactors >= 20,
    tier: 'silver',
  },
]

/**
 * 获取已解锁的成就
 */
export function getUnlockedAchievements(stats: AchievementStats): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.condition(stats))
}

/**
 * 获取下一个可解锁的成就
 */
export function getNextAchievements(stats: AchievementStats): Achievement[] {
  return ACHIEVEMENTS
    .filter(a => !a.condition(stats))
    .slice(0, 3)
}
