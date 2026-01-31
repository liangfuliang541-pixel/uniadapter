/**
 * 心情选择器组件 - 升级版
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MOOD_CONFIG, MOOD_TYPES } from '@/core/constants'
import type { MoodType } from '@/core/types'

interface MoodSelectorProps {
  selected?: MoodType | null
  onSelect: (mood: MoodType) => void
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
  animated?: boolean
}

const sizeClasses = {
  sm: 'w-12 h-12 text-xl',
  md: 'w-16 h-16 text-3xl',
  lg: 'w-20 h-20 text-4xl',
}

const moodBtnClasses: Record<MoodType, string> = {
  great: 'mood-btn-great',
  good: 'mood-btn-good',
  okay: 'mood-btn-okay',
  bad: 'mood-btn-bad',
  awful: 'mood-btn-awful',
}

export default function MoodSelector({ 
  selected, 
  onSelect, 
  size = 'md',
  showLabels = true,
  animated = true,
}: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<MoodType | null>(null)
  
  return (
    <div className="flex justify-between gap-2">
      {MOOD_TYPES.map((mood, index) => {
        const config = MOOD_CONFIG[mood]
        const isSelected = selected === mood
        const isHovered = hoveredMood === mood
        
        return (
          <button
            key={mood}
            onClick={() => onSelect(mood)}
            onMouseEnter={() => setHoveredMood(mood)}
            onMouseLeave={() => setHoveredMood(null)}
            className={cn(
              'mood-btn flex-1',
              moodBtnClasses[mood],
              sizeClasses[size],
              isSelected && 'active ring-2 ring-primary ring-offset-2 ring-offset-card',
              animated && 'animate-in',
            )}
            style={animated ? { animationDelay: `${index * 50}ms` } : undefined}
            title={config.label}
          >
            <span 
              className={cn(
                'transition-transform duration-200',
                (isSelected || isHovered) && 'scale-110'
              )}
            >
              {config.emoji}
            </span>
            {showLabels && (
              <span className={cn(
                'text-xs font-medium text-muted-foreground mt-1 transition-colors',
                isSelected && 'text-foreground'
              )}>
                {config.label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
