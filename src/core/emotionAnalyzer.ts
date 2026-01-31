/**
 * ============================================
 * 心迹 XinJi - 情绪智能分析引擎
 * ============================================
 * 
 * 基于文本内容进行情绪识别和标签生成
 * 使用关键词匹配和语义分析相结合的方法
 */

/**
 * 情绪标签接口
 */
export interface EmotionTag {
  id: string
  name: string
  confidence: number
  source: 'analysis' | 'manual'
}

/**
 * 情绪标签配置
 * 定义各种情绪相关的关键词和权重
 */
const EMOTION_TAGS = [
  // 积极情绪
  { id: 'happy', name: '快乐', keywords: ['开心', '高兴', '愉快', '兴奋', '喜悦', '欢乐', '满足'], weight: 1 },
  { id: 'grateful', name: '感恩', keywords: ['感谢', '感激', '感恩', '谢谢', '珍惜'], weight: 1 },
  { id: 'hopeful', name: '希望', keywords: ['希望', '期待', '憧憬', '相信', '信心'], weight: 1 },
  { id: 'proud', name: '自豪', keywords: ['自豪', '骄傲', '成就', '成功', '棒'], weight: 1 },
  { id: 'calm', name: '平静', keywords: ['平静', '安宁', '放松', '舒适', '平和'], weight: 1 },
  
  // 消极情绪
  { id: 'sad', name: '悲伤', keywords: ['难过', '伤心', '沮丧', '失落', '忧郁'], weight: 1 },
  { id: 'anxious', name: '焦虑', keywords: ['焦虑', '担心', '紧张', '不安', '害怕'], weight: 1 },
  { id: 'angry', name: '愤怒', keywords: ['生气', '愤怒', '恼火', '不满', '气愤'], weight: 1 },
  { id: 'tired', name: '疲惫', keywords: ['累', '疲惫', '疲倦', '困', '乏力'], weight: 1 },
  { id: 'lonely', name: '孤独', keywords: ['孤独', '孤单', '寂寞', '一个人', '冷清'], weight: 1 },
  
  // 中性情绪
  { id: 'confused', name: '困惑', keywords: ['困惑', '迷茫', '不清楚', '不知道', '疑惑'], weight: 0.8 },
  { id: 'nostalgic', name: '怀旧', keywords: ['怀念', '回忆', '过去', '从前', '小时候'], weight: 0.8 },
  { id: 'curious', name: '好奇', keywords: ['好奇', '想知道', '有趣', '新鲜', '探索'], weight: 0.8 },
] as const

/**
 * 情绪分析结果
 */
export interface EmotionAnalysisResult {
  tags: EmotionTag[]
  confidence: number
  primaryEmotion: string | null
  emotionalTone: 'positive' | 'negative' | 'neutral'
}

/**
 * 分析文本内容，生成情绪标签
 * 
 * @param text 用户输入的文本内容
 * @returns 情绪分析结果
 */
export function analyzeEmotionFromText(text: string): EmotionAnalysisResult {
  if (!text.trim()) {
    return {
      tags: [],
      confidence: 0,
      primaryEmotion: null,
      emotionalTone: 'neutral'
    }
  }

  const textLower = text.toLowerCase()
  const tagScores = new Map<string, number>()
  let totalScore = 0

  // 计算每个标签的匹配分数
  EMOTION_TAGS.forEach(tagConfig => {
    let score = 0
    tagConfig.keywords.forEach(keyword => {
      const matches = (textLower.match(new RegExp(keyword, 'g')) || []).length
      score += matches * tagConfig.weight
    })
    
    if (score > 0) {
      tagScores.set(tagConfig.id, score)
      totalScore += score
    }
  })

  // 转换为情绪标签数组
  const tags: EmotionTag[] = []
  tagScores.forEach((score, tagId) => {
    const tagConfig = EMOTION_TAGS.find(t => t.id === tagId)
    if (tagConfig) {
      tags.push({
        id: tagId,
        name: tagConfig.name,
        confidence: Math.min(score / totalScore, 1),
        source: 'analysis'
      })
    }
  })

  // 按置信度排序，取前3个
  tags.sort((a, b) => b.confidence - a.confidence)
  const topTags = tags.slice(0, 3)

  // 计算整体情绪倾向
  const positiveTags = topTags.filter(tag => 
    ['happy', 'grateful', 'hopeful', 'proud', 'calm'].includes(tag.id)
  )
  const negativeTags = topTags.filter(tag => 
    ['sad', 'anxious', 'angry', 'tired', 'lonely'].includes(tag.id)
  )

  let emotionalTone: 'positive' | 'negative' | 'neutral' = 'neutral'
  if (positiveTags.length > negativeTags.length) {
    emotionalTone = 'positive'
  } else if (negativeTags.length > positiveTags.length) {
    emotionalTone = 'negative'
  }

  // 确定主要情绪
  const primaryEmotion = topTags.length > 0 ? topTags[0].name : null

  return {
    tags: topTags,
    confidence: totalScore > 0 ? Math.min(totalScore / 20, 1) : 0, // 标准化置信度
    primaryEmotion,
    emotionalTone
  }
}

/**
 * 生成情绪写作提示
 * 
 * @param emotion 检测到的主要情绪
 * @returns 个性化的写作提示
 */
export function generateEmotionPrompt(emotion: string | null): string {
  const prompts: Record<string, string[]> = {
    '快乐': [
      '分享一下让你感到快乐的具体时刻吧',
      '这种快乐的感觉是从何而来的？',
      '希望你能记住并延续这份美好的感受'
    ],
    '悲伤': [
      '愿意聊聊是什么让你感到难过吗？',
      '虽然现在很难过，但请相信这种感觉会过去的',
      '允许自己感受这份悲伤，它是成长的一部分'
    ],
    '焦虑': [
      '让我们一起理清让你焦虑的事情',
      '深呼吸，一次只专注解决一个问题',
      '焦虑提醒我们在乎某些重要的事情'
    ],
    '愤怒': [
      '是什么让你如此愤怒？表达愤怒是正当的',
      '愤怒背后通常隐藏着更深层的需求',
      '让我们找到更健康的方式来处理这份愤怒'
    ],
    '平静': [
      '享受这份难得的宁静时光',
      '平静的状态非常适合自我反思',
      '这种内心的平和是珍贵的内心资源'
    ],
    'default': [
      '记录下此刻的真实感受',
      '你的每一种情绪都值得被看见和理解',
      '感谢你愿意诚实地面对自己的内心'
    ]
  }

  const emotionPrompts = prompts[emotion || ''] || prompts.default
  return emotionPrompts[Math.floor(Math.random() * emotionPrompts.length)]
}

/**
 * 情绪趋势分析
 * 
 * @param recentEntries 最近的情绪记录
 * @returns 情绪趋势报告
 */
export function analyzeEmotionTrend(recentEntries: { mood: string; content: string }[]): string {
  if (recentEntries.length < 3) {
    return '记录更多心情，系统会为你生成专属的情绪趋势分析'
  }

  const emotions = recentEntries.map(entry => analyzeEmotionFromText(entry.content))
  const positiveCount = emotions.filter(e => e.emotionalTone === 'positive').length
  
  const ratio = positiveCount / recentEntries.length
  
  if (ratio > 0.7) {
    return '🌟 最近你的情绪整体偏积极，继续保持这份美好的状态！'
  } else if (ratio < 0.3) {
    return '💪 最近情绪波动较大，但这也是了解自己的好机会，加油！'
  } else {
    return '⚖️ 最近的情绪起伏很自然，这种平衡状态说明你正在成长'
  }
}