/**
 * 冥想指导组件
 * 提供情绪调节的冥想和放松指导内容
 */
import { useState } from 'react'
import { Play, Pause, RotateCcw, Volume2, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MEDITATION_GUIDES, formatDuration } from '@/core/meditation'
import type { MeditationGuide } from '@/core/meditation'

interface MeditationGuideProps {
  moodType?: string
  className?: string
}

export default function MeditationGuide({ moodType, className }: MeditationGuideProps) {
  const [currentGuide, setCurrentGuide] = useState<MeditationGuide | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  const guides = moodType ? 
    Object.values(MEDITATION_GUIDES).slice(0, 2) : 
    Object.values(MEDITATION_GUIDES)

  const startMeditation = (guide: MeditationGuide) => {
    setCurrentGuide(guide)
    setCurrentStep(0)
    setTimeLeft(guide.steps[0].duration)
    setIsPlaying(true)
  }

  const stopMeditation = () => {
    setIsPlaying(false)
    setCurrentGuide(null)
    setCurrentStep(0)
    setTimeLeft(0)
  }

  if (currentGuide && isPlaying) {
    return (
      <div className={cn('card p-6', className)}>
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{currentGuide.emoji}</div>
          <h3 className="text-xl font-semibold mb-1">{currentGuide.title}</h3>
          <p className="text-sm text-muted-foreground">{currentGuide.description}</p>
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-mono font-bold text-primary mb-2">
            {formatDuration(timeLeft)}
          </div>
          <div className="text-sm text-muted-foreground">
            步骤 {currentStep + 1}/{currentGuide.steps.length}
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <p className="text-center text-foreground">
            {currentGuide.steps[currentStep].text}
          </p>
          {currentGuide.steps[currentStep].instruction && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {currentGuide.steps[currentStep].instruction}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={stopMeditation}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重新开始
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            className="btn-primary flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            暂停
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('card p-5', className)}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Volume2 className="w-5 h-5 text-primary" />
        情绪调节冥想
      </h3>
      
      <p className="text-muted-foreground text-sm mb-4">
        根据你当前的情绪状态，选择合适的冥想练习来帮助调节心情
      </p>

      <div className="space-y-3">
        {guides.map((guide) => (
          <button
            key={guide.id}
            onClick={() => startMeditation(guide)}
            className="w-full text-left p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{guide.emoji}</span>
                  <h4 className="font-medium">{guide.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {guide.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>⏱️ {formatDuration(guide.duration)}</span>
                  <span>•</span>
                  <span>{guide.steps.length}个步骤</span>
                </div>
              </div>
              <Play className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}