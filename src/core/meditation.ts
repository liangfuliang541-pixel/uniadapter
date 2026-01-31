/**
 * ============================================
 * 心迹 XinJi - 冥想指导模块
 * ============================================
 * 
 * 提供情绪调节的冥想和放松指导内容
 */

// 冥想指导类型
export type MeditationType = 'breathing' | 'bodyScan' | 'mindfulness' | 'gratitude'

export interface MeditationGuide {
  id: string
  type: MeditationType
  title: string
  duration: number  // 时长(秒)
  steps: MeditationStep[]
  emoji: string
  color: string
  description: string
}

export interface MeditationStep {
  text: string
  duration: number  // 持续时间(秒)
  instruction?: string
}

// 冥想指导数据
export const MEDITATION_GUIDES: Record<MeditationType, MeditationGuide> = {
  breathing: {
    id: 'breathing_1',
    type: 'breathing',
    title: '深呼吸放松法',
    duration: 300,  // 5分钟
    emoji: '🧘‍♀️',
    color: 'bg-blue-100 text-blue-600',
    description: '通过深呼吸来缓解焦虑和压力',
    steps: [
      {
        text: '找个舒适的姿势坐下',
        duration: 30,
        instruction: '闭上眼睛，保持背部挺直但放松'
      },
      {
        text: '缓慢吸气4秒',
        duration: 4,
        instruction: '通过鼻子深吸气，感受空气充满肺部'
      },
      {
        text: '屏住呼吸4秒',
        duration: 4,
        instruction: '轻轻屏住呼吸'
      },
      {
        text: '缓慢呼气6秒',
        duration: 6,
        instruction: '通过嘴巴慢慢呼出所有空气'
      },
      {
        text: '重复循环',
        duration: 240,
        instruction: '继续深呼吸模式，专注于呼吸节奏'
      },
      {
        text: '慢慢结束',
        duration: 12,
        instruction: '缓缓睁开眼睛，感受放松的状态'
      }
    ]
  },

  bodyScan: {
    id: 'bodyscan_1',
    type: 'bodyScan',
    title: '身体扫描冥想',
    duration: 600,  // 10分钟
    emoji: '✨',
    color: 'bg-purple-100 text-purple-600',
    description: '逐个部位放松身体，释放紧张感',
    steps: [
      {
        text: '平躺或坐下放松',
        duration: 30,
        instruction: '闭上眼睛，全身放松'
      },
      {
        text: '从脚趾开始关注',
        duration: 30,
        instruction: '感受脚趾的触感'
      },
      {
        text: '逐渐向上移动注意力',
        duration: 420,
        instruction: '依次关注脚踝、小腿、膝盖、大腿、臀部、腹部、胸部、手臂、肩膀、脖子、脸部'
      },
      {
        text: '全身扫描完成',
        duration: 60,
        instruction: '感受整个身体的放松状态'
      },
      {
        text: '慢慢回到当下',
        duration: 30,
        instruction: '轻柔地移动手指和脚趾'
      }
    ]
  },

  mindfulness: {
    id: 'mindfulness_1',
    type: 'mindfulness',
    title: '正念觉察练习',
    duration: 300,  // 5分钟
    emoji: '👁️',
    color: 'bg-green-100 text-green-600',
    description: '培养对当下时刻的觉察力',
    steps: [
      {
        text: '专注当下',
        duration: 30,
        instruction: '坐下或站立，专注于当下的感觉'
      },
      {
        text: '观察呼吸',
        duration: 60,
        instruction: '不控制呼吸，只是观察它自然的流动'
      },
      {
        text: '注意身体感觉',
        duration: 90,
        instruction: '注意身体任何部位的感觉，不评判'
      },
      {
        text: '观察思维',
        duration: 90,
        instruction: '观察脑海中浮现的想法，像云朵一样飘过'
      },
      {
        text: '回到当下',
        duration: 30,
        instruction: '轻轻将注意力带回到此刻'
      }
    ]
  },

  gratitude: {
    id: 'gratitude_1',
    type: 'gratitude',
    title: '感恩冥想',
    duration: 300,  // 5分钟
    emoji: '🙏',
    color: 'bg-yellow-100 text-yellow-600',
    description: '培养感恩之心，提升积极情绪',
    steps: [
      {
        text: '舒适的姿势',
        duration: 30,
        instruction: '找到一个舒适的冥想姿势'
      },
      {
        text: '深呼吸三次',
        duration: 30,
        instruction: '进行三次深呼吸，平静心绪'
      },
      {
        text: '回忆三个感恩的事物',
        duration: 180,
        instruction: '慢慢回想生活中值得感恩的人和事'
      },
      {
        text: '感受感恩的情感',
        duration: 30,
        instruction: '在心中感谢这些美好事物'
      },
      {
        text: '扩展感恩之情',
        duration: 30,
        instruction: '将这种感恩之情扩展到更多生活层面'
      }
    ]
  }
}

// 根据情绪状态推荐冥想
export function recommendMeditation(moodType: string): MeditationGuide[] {
  const recommendations: Record<string, MeditationType[]> = {
    'awful': ['breathing', 'bodyScan'],
    'bad': ['breathing', 'gratitude'],
    'okay': ['mindfulness', 'gratitude'],
    'good': ['mindfulness', 'gratitude'],
    'great': ['gratitude', 'mindfulness']
  }
  
  const types = recommendations[moodType] || ['breathing', 'gratitude']
  return types.map(type => MEDITATION_GUIDES[type])
}

// 格式化时长显示
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}