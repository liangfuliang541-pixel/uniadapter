/**
 * 智能情绪标签组件
 * 基于用户日记内容自动生成情绪标签
 */

import { useState, useEffect } from 'react'
import { Sparkles, Tag, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { analyzeEmotionFromText } from '@/core/emotionAnalyzer'
import type { EmotionTag } from '@/core/emotionAnalyzer'

interface SmartEmotionTagsProps {
  content: string
  onTagsChange?: (tags: EmotionTag[]) => void
  maxTags?: number
  className?: string
}

export default function SmartEmotionTags({ 
  content, 
  onTagsChange,
  maxTags = 5,
  className 
}: SmartEmotionTagsProps) {
  const [tags, setTags] = useState<EmotionTag[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAll, setShowAll] = useState(false)

  // 当内容变化时重新分析
  useEffect(() => {
    if (content.trim().length > 10) { // 只有内容足够长才分析
      analyzeContent()
    } else {
      setTags([])
    }
  }, [content])

  const analyzeContent = async () => {
    if (!content.trim()) return
    
    setIsAnalyzing(true)
    try {
      const result = await analyzeEmotionFromText(content)
      const limitedTags = result.tags.slice(0, maxTags)
      setTags(limitedTags)
      onTagsChange?.(limitedTags)
    } catch (error) {
      console.error('情绪分析失败:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const removeTag = (tagId: string) => {
    const newTags = tags.filter(t => t.id !== tagId)
    setTags(newTags)
    onTagsChange?.(newTags)
  }

  const displayedTags = showAll ? tags : tags.slice(0, 3)

  if (tags.length === 0 && !isAnalyzing) return null

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            智能情绪标签
          </span>
          {isAnalyzing && (
            <span className="text-xs text-muted-foreground">分析中...</span>
          )}
        </div>
        
        {tags.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-primary hover:underline"
          >
            {showAll ? '收起' : `展开(${tags.length})`}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {displayedTags.map((tag) => (
          <div
            key={tag.id}
            className={cn(
              'group flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              'border hover:scale-105',
              tag.confidence > 0.8 
                ? 'bg-green-100/80 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50'
                : tag.confidence > 0.6
                ? 'bg-blue-100/80 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50'
                : 'bg-yellow-100/80 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50'
            )}
          >
            <Tag className="w-3 h-3" />
            <span>{tag.name}</span>
            <span className="text-xs opacity-70">
              ({Math.round(tag.confidence * 100)}%)
            </span>
            <button
              onClick={() => removeTag(tag.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {tags.length > 0 && (
        <p className="text-xs text-muted-foreground">
          基于内容分析自动生成 • 点击 × 可移除不需要的标签
        </p>
      )}
    </div>
  )
}