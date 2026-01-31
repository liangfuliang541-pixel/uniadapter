/**
 * AI助手组件
 * 提供智能写作提示和情绪建议
 */

import { useState } from 'react'
import { Bot, Sparkles, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIHelperProps {
  content: string
  mood: string
  className?: string
}

export default function AIHelper({ 
  content, 
  mood,
  className 
}: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // 简单的情绪建议生成
  const generateSuggestion = () => {
    const suggestions = {
      'great': '继续保持这份美好的心情！可以分享一下是什么让你感到如此开心吗？',
      'good': '今天感觉不错呢！记得珍惜这些美好的时刻。',
      'okay': '平静的一天也很好，有时候平淡就是幸福。',
      'bad': '每个人都会有低落的时候，这很正常。愿意聊聊是什么让你感到不开心吗？',
      'awful': '看起来今天很难熬，但请记住这种感觉会过去的。你并不孤单。'
    }
    
    return suggestions[mood as keyof typeof suggestions] || '记录下此刻的感受，这是了解自己的重要一步。'
  }

  if (!content.trim()) return null

  return (
    <div className={cn('space-y-2', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <Bot className="w-4 h-4" />
        AI助手建议
        <span className="text-xs text-muted-foreground">
          {isOpen ? '收起' : '展开'}
        </span>
      </button>
      
      {isOpen && (
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-2">情绪洞察</h4>
              <p className="text-sm text-foreground leading-relaxed">
                {generateSuggestion()}
              </p>
              <div className="mt-3 pt-3 border-t border-primary/10">
                <p className="text-xs text-muted-foreground">
                  基于你的情绪状态生成的个性化建议
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}