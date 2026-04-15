import { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { Button, Card, Dialog, Toast, useUniToast, useVibeGenerate } from '@liangfu/uniadapter'

export default function VibeDemo() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useUniToast()
  const { generate } = useVibeGenerate()

  const handleVibeGenerate = async () => {
    if (!prompt.trim()) {
      toast.show({ message: '请输入需求描述', type: 'warning' })
      return
    }
    setLoading(true)
    try {
      const code = await generate(prompt, { platform: 'weapp', page: 'demo' })
      setGeneratedCode(code)
      toast.show({ message: '生成成功！', type: 'success' })
    } catch (err) {
      toast.show({ message: '生成失败，请重试', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="page-container">
      {/* Header */}
      <View className="header">
        <Text className="title">🎨 VibeKit Demo</Text>
        <Text className="subtitle">Vibe-first Mini-Program Starter</Text>
      </View>

      {/* VibeUI Components Demo */}
      <Card title="📦 VibeUI 组件展示">
        <View className="comp-row">
          <Button size="small">Primary</Button>
          <Button size="small" type="secondary">Secondary</Button>
          <Button size="small" plain>Plain</Button>
        </View>
        <View className="comp-row">
          <Button size="small" shape="round">Round</Button>
          <Button size="small" disabled>Disabled</Button>
          <Button size="small" loading>Loading</Button>
        </View>
      </Card>

      {/* AI Vibe Generator */}
      <Card title="🌀 AI Vibe 生成器">
        <View className="vibe-input-wrapper">
          <Input
            className="vibe-input"
            placeholder="描述你想要的页面，比如：做一个商品列表页，含搜索和筛选"
            value={prompt}
            onInput={e => setPrompt(e.detail.value)}
            onConfirm={handleVibeGenerate}
          />
          <Button
            size="medium"
            type="primary"
            onClick={handleVibeGenerate}
            loading={loading}
          >
            {loading ? '生成中...' : '🌀 Vibe it!'}
          </Button>
        </View>

        {generatedCode && (
          <View className="generated-code">
            <Text className="code-label">生成的代码：</Text>
            <View className="code-block">
              <Text>{generatedCode}</Text>
            </View>
          </View>
        )}
      </Card>

      {/* Quick Actions */}
      <Card title="⚡ 快速操作">
        <View className="quick-actions">
          <Button size="small" onClick={() => toast.show({ message: 'Hello VibeKit!', type: 'success' })}>
            Toast 提示
          </Button>
          <Button
            size="small"
            onClick={() => Dialog.alert({ title: 'VibeKit', message: '这是 VibeUI 的 Dialog 组件！' })}
          >
            Dialog 弹窗
          </Button>
        </View>
      </Card>
    </View>
  )
}
