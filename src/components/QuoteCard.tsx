/**
 * 情绪语录卡片组件
 */

import { useState, useEffect } from 'react'
import { RefreshCw, Quote } from 'lucide-react'
import { getRandomQuote, type Quote as QuoteType } from '@/core/quotes'
import type { MoodType } from '@/core/types'

interface QuoteCardProps {
  mood: MoodType
}

export default function QuoteCard({ mood }: QuoteCardProps) {
  const [quote, setQuote] = useState<QuoteType>(() => getRandomQuote(mood))
  const [isAnimating, setIsAnimating] = useState(false)
  
  const refresh = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setQuote(getRandomQuote(mood))
      setIsAnimating(false)
    }, 300)
  }
  
  useEffect(() => {
    setQuote(getRandomQuote(mood))
  }, [mood])
  
  return (
    <div className="card p-5 relative overflow-hidden">
      {/* 装饰引号 */}
      <Quote className="absolute top-3 left-3 w-8 h-8 text-primary/10" />
      
      <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-foreground leading-relaxed pl-6 pr-8 min-h-[60px]">
          "{quote.text}"
        </p>
        {quote.author && (
          <p className="text-sm text-muted-foreground mt-2 pl-6">
            —— {quote.author}
          </p>
        )}
      </div>
      
      <button
        onClick={refresh}
        className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
        title="换一条"
      >
        <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )
}
