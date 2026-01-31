/**
 * 成就徽章组件
 */

import { cn } from '@/lib/utils'
import type { Achievement } from '@/core/quotes'

interface AchievementBadgeProps {
  achievement: Achievement
  unlocked: boolean
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-slate-300 to-slate-500',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-indigo-600',
}

const tierBg = {
  bronze: 'bg-amber-100 dark:bg-amber-900/30',
  silver: 'bg-slate-100 dark:bg-slate-800/30',
  gold: 'bg-yellow-100 dark:bg-yellow-900/30',
  platinum: 'bg-purple-100 dark:bg-purple-900/30',
}

const sizeClasses = {
  sm: 'w-12 h-12 text-xl',
  md: 'w-16 h-16 text-2xl',
  lg: 'w-20 h-20 text-3xl',
}

export default function AchievementBadge({ 
  achievement, 
  unlocked, 
  size = 'md',
  showDetails = true 
}: AchievementBadgeProps) {
  return (
    <div className={cn(
      'flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300',
      unlocked ? tierBg[achievement.tier] : 'bg-muted/30',
      !unlocked && 'opacity-40 grayscale'
    )}>
      <div className={cn(
        'rounded-full flex items-center justify-center',
        sizeClasses[size],
        unlocked && `bg-gradient-to-br ${tierColors[achievement.tier]} shadow-lg`
      )}>
        <span className={unlocked ? '' : 'grayscale'}>{achievement.icon}</span>
      </div>
      
      {showDetails && (
        <div className="text-center">
          <p className={cn(
            'font-medium text-sm',
            unlocked ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {achievement.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {achievement.description}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * 成就列表组件
 */

interface AchievementListProps {
  achievements: Achievement[]
  unlockedIds: Set<string>
}

export function AchievementList({ achievements, unlockedIds }: AchievementListProps) {
  const unlocked = achievements.filter(a => unlockedIds.has(a.id))
  const locked = achievements.filter(a => !unlockedIds.has(a.id))
  
  return (
    <div className="space-y-6">
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            已解锁 ({unlocked.length}/{achievements.length})
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {unlocked.map((a, i) => (
              <div 
                key={a.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <AchievementBadge achievement={a} unlocked size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {locked.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            待解锁
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {locked.slice(0, 6).map((a) => (
              <AchievementBadge 
                key={a.id} 
                achievement={a} 
                unlocked={false} 
                size="sm" 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
