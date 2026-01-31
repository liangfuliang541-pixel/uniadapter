/**
 * 心情分布图组件
 */

import { cn } from '@/lib/utils'
import { MOOD_CONFIG, MOOD_TYPES } from '@/core/constants'
import type { MoodType } from '@/core/types'

const moodBgColors: Record<MoodType, string> = {
  great: 'bg-[hsl(var(--mood-great))]',
  good: 'bg-[hsl(var(--mood-good))]',
  okay: 'bg-[hsl(var(--mood-okay))]',
  bad: 'bg-[hsl(var(--mood-bad))]',
  awful: 'bg-[hsl(var(--mood-awful))]',
}

interface MoodDistributionProps {
  data: Record<MoodType, number>
  total: number
}

export default function MoodDistribution({ data, total }: MoodDistributionProps) {
  return (
    <div className="space-y-3">
      {MOOD_TYPES.map((mood, index) => {
        const config = MOOD_CONFIG[mood]
        const count = data[mood]
        const percentage = total > 0 ? (count / total) * 100 : 0
        
        return (
          <div 
            key={mood} 
            className="flex items-center gap-3 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-xl w-8 flex-shrink-0">{config.emoji}</span>
            <div className="flex-1">
              <div className="progress-bar">
                <div
                  className={cn('progress-bar-fill', moodBgColors[mood])}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 w-20 justify-end">
              <span className="text-sm font-medium">{count}次</span>
              <span className="text-xs text-muted-foreground w-10 text-right">
                {percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
