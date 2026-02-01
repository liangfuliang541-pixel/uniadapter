/**
 * ============================================
 * 心迹 XinJi - 日记服务层
 * ============================================
 * 
 * 核心业务逻辑层，处理日记的增删改查和统计分析
 * 这一层与平台无关，可以在任何平台上复用
 * 
 * @author 心迹团队
 * @version 1.0.0
 * @copyright © 2024-2025 福建省小南同学网络科技有限公司. 保留所有权利。
 * @contact 3578544805@qq.com
 */

import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import type { JournalEntry, MoodType, MoodStats, EmotionFactor } from '../types'
import { storage } from '../platforms/storage'
import { APP_CONFIG, MOOD_CONFIG } from '../constants'

const { storageKeys } = APP_CONFIG

/**
 * 日记服务类
 * 单例模式，管理所有日记相关的业务逻辑
 * 
 * 提供日记的增删改查功能以及数据分析和统计功能
 * 支持多种数据导出格式，适用于"心迹"情绪追踪日记应用
 */
class JournalService {
  private entries: JournalEntry[] = []  // 内存中的日记数据
  private initialized = false           // 是否已初始化
  
  /**
   * 初始化服务
   * 从本地存储加载数据到内存
   */
  async init(): Promise<void> {
    if (this.initialized) return
    const data = await storage().get<JournalEntry[]>(storageKeys.entries)
    this.entries = data || []
    this.initialized = true
  }
  
  /**
   * 保存数据到本地存储
   */
  private async save(): Promise<void> {
    await storage().set(storageKeys.entries, this.entries)
  }
  
  // ==================== 增删改查操作 ====================
  
  /**
   * 创建新的日记条目
   * 如果当天已有记录，则更新现有记录
   * 
   * @param entry 日记数据（不含id和时间戳）
   * @returns 创建的日记条目
   */
  async create(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'moodScore'>): Promise<JournalEntry> {
    await this.init()
    
    // 构建完整的日记对象
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),  // 生成唯一ID
      moodScore: MOOD_CONFIG[entry.mood].score,  // 根据心情类型获取分数
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    // 检查是否已有当天记录，如有则更新
    const existingIndex = this.entries.findIndex(e => e.date === entry.date)
    if (existingIndex >= 0) {
      this.entries[existingIndex] = { 
        ...this.entries[existingIndex], 
        ...newEntry, 
        id: this.entries[existingIndex].id  // 保留原ID
      }
    } else {
      this.entries.push(newEntry)
    }
    
    await this.save()
    return newEntry
  }
  
  /**
   * 更新日记条目
   * 
   * @param id 日记ID
   * @param updates 要更新的字段
   * @returns 更新后的日记，如果不存在返回null
   */
  async update(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> {
    await this.init()
    
    const index = this.entries.findIndex(e => e.id === id)
    if (index === -1) return null
    
    const updated: JournalEntry = {
      ...this.entries[index],
      ...updates,
      updatedAt: Date.now(),
    }
    
    // 如果更新了心情类型，同步更新分数
    if (updates.mood) {
      updated.moodScore = MOOD_CONFIG[updates.mood].score
    }
    
    this.entries[index] = updated
    await this.save()
    return updated
  }
  
  /**
   * 删除日记条目
   * 
   * @param id 日记ID
   * @returns 是否删除成功
   */
  async delete(id: string): Promise<boolean> {
    await this.init()
    
    const index = this.entries.findIndex(e => e.id === id)
    if (index === -1) return false
    
    this.entries.splice(index, 1)
    await this.save()
    return true
  }
  
  // ==================== 查询操作 ====================
  
  /**
   * 获取所有日记（按时间倒序）
   */
  async getAll(): Promise<JournalEntry[]> {
    await this.init()
    return [...this.entries].sort((a, b) => b.createdAt - a.createdAt)
  }
  
  /**
   * 根据ID获取日记
   */
  async getById(id: string): Promise<JournalEntry | null> {
    await this.init()
    return this.entries.find(e => e.id === id) || null
  }
  
  /**
   * 根据日期获取日记
   * 
   * @param date 日期字符串 (YYYY-MM-DD)
   */
  async getByDate(date: string): Promise<JournalEntry | null> {
    await this.init()
    return this.entries.find(e => e.date === date) || null
  }
  
  /**
   * 获取日期范围内的日记
   */
  async getByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    await this.init()
    return this.entries
      .filter(e => e.date >= startDate && e.date <= endDate)
      .sort((a, b) => a.date.localeCompare(b.date))
  }
  
  /**
   * 获取指定月份的日记
   */
  async getByMonth(year: number, month: number): Promise<JournalEntry[]> {
    const start = format(startOfMonth(new Date(year, month)), 'yyyy-MM-dd')
    const end = format(endOfMonth(new Date(year, month)), 'yyyy-MM-dd')
    return this.getByDateRange(start, end)
  }
  
  /**
   * 搜索日记内容
   */
  async search(query: string): Promise<JournalEntry[]> {
    await this.init()
    const lowerQuery = query.toLowerCase()
    return this.entries
      .filter(e => 
        e.plainText.toLowerCase().includes(lowerQuery) ||
        e.tags.some(t => t.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => b.createdAt - a.createdAt)
  }
  
  /**
   * 根据心情类型筛选
   */
  async getByMood(mood: MoodType): Promise<JournalEntry[]> {
    await this.init()
    return this.entries
      .filter(e => e.mood === mood)
      .sort((a, b) => b.createdAt - a.createdAt)
  }
  
  /**
   * 根据因素筛选
   */
  async getByFactor(factorId: string): Promise<JournalEntry[]> {
    await this.init()
    return this.entries
      .filter(e => e.factors.some(f => f.id === factorId))
      .sort((a, b) => b.createdAt - a.createdAt)
  }
  
  // ==================== 统计分析 ====================
  
  /**
   * 获取完整统计数据
   */
  async getStats(): Promise<MoodStats | null> {
    await this.init()
    
    if (this.entries.length === 0) return null
    
    // 计算心情分布
    const moodDistribution: Record<MoodType, number> = {
      great: 0, good: 0, okay: 0, bad: 0, awful: 0
    }
    this.entries.forEach(e => {
      moodDistribution[e.mood]++
    })
    
    // 计算平均分数
    const avgScore = this.entries.reduce((sum, e) => sum + e.moodScore, 0) / this.entries.length
    
    // 计算连续记录天数
    const { streak, longestStreak } = this.calculateStreaks()
    
    // 计算因素关联
    const factorCorrelation = this.calculateFactorCorrelation()
    
    // 计算星期模式
    const weekdayPattern = this.calculateWeekdayPattern()
    
    // 计算月度趋势
    const monthlyTrend = this.calculateMonthlyTrend()
    
    return {
      totalEntries: this.entries.length,
      avgScore,
      streak,
      longestStreak,
      moodDistribution,
      factorCorrelation,
      weekdayPattern,
      monthlyTrend,
    }
  }
  
  /**
   * 计算连续记录天数
   */
  private calculateStreaks(): { streak: number; longestStreak: number } {
    // 获取所有不重复的日期并排序
    const sortedDates = [...new Set(this.entries.map(e => e.date))].sort().reverse()
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    const today = format(new Date(), 'yyyy-MM-dd')
    let checkDate = today
    
    // 计算当前连续天数
    for (const date of sortedDates) {
      if (date === checkDate) {
        currentStreak++
        checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd')
      } else break
    }
    
    // 计算历史最长连续天数
    let prevDate = ''
    for (const date of sortedDates.reverse()) {
      if (prevDate && format(subDays(parseISO(prevDate), 1), 'yyyy-MM-dd') === date) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
      prevDate = date
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak)
    
    return { streak: currentStreak, longestStreak }
  }
  
  /**
   * 计算因素与心情的关联
   */
  private calculateFactorCorrelation() {
    const factorStats = new Map<string, { factor: EmotionFactor; totalScore: number; count: number }>()
    
    // 统计每个因素的出现次数和总分
    this.entries.forEach(e => {
      e.factors.forEach(f => {
        const existing = factorStats.get(f.id) || { factor: f, totalScore: 0, count: 0 }
        existing.totalScore += e.moodScore
        existing.count++
        factorStats.set(f.id, existing)
      })
    })
    
    // 计算总体平均分
    const avgOverall = this.entries.reduce((sum, e) => sum + e.moodScore, 0) / this.entries.length
    
    // 计算每个因素的影响程度
    return Array.from(factorStats.values())
      .map(({ factor, totalScore, count }) => ({
        factor,
        avgMoodScore: totalScore / count,
        occurrences: count,
        impact: (totalScore / count - avgOverall) / 2, // 影响度范围 -1 到 1
      }))
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
  }
  
  /**
   * 计算星期几的心情模式
   */
  private calculateWeekdayPattern() {
    const weekdayStats = Array.from({ length: 7 }, (_, i) => ({ 
      day: i, 
      totalScore: 0, 
      count: 0 
    }))
    
    this.entries.forEach(e => {
      const day = parseISO(e.date).getDay()
      weekdayStats[day].totalScore += e.moodScore
      weekdayStats[day].count++
    })
    
    return weekdayStats.map(({ day, totalScore, count }) => ({
      day,
      avgScore: count > 0 ? totalScore / count : 0,
      count,
    }))
  }
  
  /**
   * 计算月度心情趋势
   */
  private calculateMonthlyTrend() {
    const monthlyStats = new Map<string, { 
      year: number
      month: number
      totalScore: number
      count: number
      best: { date: string; score: number }
      worst: { date: string; score: number }
    }>()
    
    this.entries.forEach(e => {
      const date = parseISO(e.date)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const existing = monthlyStats.get(key) || {
        year: date.getFullYear(),
        month: date.getMonth(),
        totalScore: 0,
        count: 0,
        best: { date: e.date, score: 0 },
        worst: { date: e.date, score: 6 },
      }
      
      existing.totalScore += e.moodScore
      existing.count++
      
      if (e.moodScore > existing.best.score) {
        existing.best = { date: e.date, score: e.moodScore }
      }
      if (e.moodScore < existing.worst.score) {
        existing.worst = { date: e.date, score: e.moodScore }
      }
      
      monthlyStats.set(key, existing)
    })
    
    return Array.from(monthlyStats.values())
      .map(({ year, month, totalScore, count, best, worst }) => ({
        year,
        month,
        avgScore: totalScore / count,
        count,
        bestDay: best.date,
        worstDay: worst.date,
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })
      .slice(0, 12)  // 只返回最近12个月
  }
  
  // ==================== 数据导出 ====================
  
  /**
   * 导出为JSON格式
   */
  async exportToJSON(): Promise<string> {
    await this.init()
    return JSON.stringify({
      version: APP_CONFIG.version,
      exportedAt: new Date().toISOString(),
      entries: this.entries,
    }, null, 2)
  }
  
  /**
   * 导出为Markdown格式
   */
  async exportToMarkdown(): Promise<string> {
    await this.init()
    
    const sortedEntries = [...this.entries].sort((a, b) => a.date.localeCompare(b.date))
    
    let md = `# 心迹 - 情绪日记导出\n\n`
    md += `导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`
    md += `---\n\n`
    
    for (const entry of sortedEntries) {
      md += `## ${entry.date} ${MOOD_CONFIG[entry.mood].emoji}\n\n`
      if (entry.title) {
        md += `### ${entry.title}\n\n`
      }
      md += `${entry.plainText}\n\n`
      if (entry.tags.length > 0) {
        md += `标签: ${entry.tags.map(t => `#${t}`).join(' ')}\n\n`
      }
      if (entry.factors.length > 0) {
        md += `因素: ${entry.factors.map(f => f.icon + f.name).join(', ')}\n\n`
      }
      md += `---\n\n`
    }
    
    return md
  }
}

/**
 * 导出日记服务单例实例
 * 
 * 为应用提供全局唯一的日记服务访问点
 * 该实例在整个应用生命周期内保持单一状态
 */
export const journalService = new JournalService()

/**
 * ============================================
 * 心迹 XinJi - 日记服务层
 * ============================================
 * 
 * @description 核心业务逻辑层，处理日记的增删改查和统计分析
 * @author 心迹团队
 * @version 1.0.0
 * @copyright © 2024-2025 福建省小南同学网络科技有限公司. 保留所有权利。
 * @contact 3578544805@qq.com
 */
