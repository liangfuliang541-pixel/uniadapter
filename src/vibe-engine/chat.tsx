/**
 * VibePage - AI 一句话生成完整小程序页面
 *
 * 进化方向：vibe coding × 小程序 × 实时预览
 *
 * 核心理念：告诉 AI 你想要什么页面，它生成完整源代码 + 实时预览
 *
 * @example
 * import { VibePage } from '@liangfu/uniadapter/vibe-engine'
 * ;<VibePage
 *   platform="weapp"
 *   apiKey={userApiKey}
 *   model="anthropic/claude-3.5-sonnet"
 *   onGenerate={(code, platform) => saveToProject(code, platform)}
 * />
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'

// ── 类型 ─────────────────────────────────────────────────────────────────────

export interface VibePageProps {
  /** 目标平台 */
  platform?: 'weapp' | 'alipay' | 'douyin' | 'h5'
  /** LLM API Key（用户自行提供） */
  apiKey?: string
  /** 模型，默认 claude */
  model?: string
  /** OpenRouter base URL（兼容 OpenAI 格式） */
  baseUrl?: string
  /** 生成完成回调 */
  onGenerate?: (code: GeneratedFile[], platform: string) => void
  /** 主题 */
  theme?: 'light' | 'dark'
  /** 语言 */
  lang?: 'zh' | 'en'
}

export interface GeneratedFile {
  filename: string
  content: string
  language: 'typescript' | 'javascript' | 'wxml' | 'axml' | 'css' | 'json'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  files?: GeneratedFile[]
  streaming?: boolean
  timestamp: number
  error?: string
}

// ── 流式 API 调用 ────────────────────────────────────────────────────────────

async function* streamGenerate(
  apiKey: string,
  model: string,
  prompt: string,
  platform: string,
  baseUrl = 'https://openrouter.ai/api/v1'
): AsyncGenerator<string> {
  const systemPrompt = `你是 UniAdapter VibePage，一个专为跨端小程序开发而训练的 AI 助手。

你的任务是根据用户的自然语言描述，生成完整的 UniAdapter/VibeUI 页面源代码。

输出要求（严格遵循）：
1. 只输出 UniAdapter 适配器代码，不要包装层代码
2. 使用 TypeScript（.ts）或 WXML/WXSS/JSON（小程序的 .ts 组件）
3. 代码必须完整、可运行
4. 包含中文注释
5. 保持简洁

输出格式（必须用这个格式，用 ---FILE:filename--- 标记每个文件）：

---FILE:pages/demo/index.ts---
<LANG:typescript>
// 页面逻辑代码
import { useUniRouter, useUniState } from '@liangfu/uniadapter'

Page({ ... })
<CODEBLOCK>

---FILE:pages/demo/index.wxml---
<LANG:wxml>
<!-- 模板代码 -->
<CODEBLOCK>

---FILE:pages/demo/index.json---
<LANG:json>
{
  "usingComponents": {}
}
<CODEBLOCK>

---FILE:pages/demo/index.wxss---
<LANG:css>
/* 样式代码 */
<CODEBLOCK>

只输出代码，不要解释。`

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://liangfu.github.io/uniadapter',
      'X-Title': 'UniAdapter VibePage',
    },
    body: JSON.stringify({
      model: model || 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `生成一个小程序页面。目标平台：${platform}。需求：${prompt}` },
      ],
      stream: true,
      temperature: 0.3,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API 错误 (${response.status}): ${err}`)
  }

  if (!response.body) throw new Error('流式响应不可用')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') return
      try {
        const json = JSON.parse(data)
        const content = json.choices?.[0]?.delta?.content
        if (content) yield content
      } catch {}
    }
  }
}

// ── 代码解析 ─────────────────────────────────────────────────────────────────

function parseGeneratedFiles(content: string): GeneratedFile[] {
  const files: GeneratedFile[] = []
  const filePattern = /---FILE:([^\n]+)---[\s\S]*?```(\w+)?\n?([\s\S]*?)```/g
  let match

  while ((match = filePattern.exec(content)) !== null) {
    const filename = match[1].trim()
    const lang = (match[2] || detectLang(filename)) as any
    const code = match[3].trim()

    if (filename && code && code.length > 10) {
      files.push({ filename, content: code, language: lang })
    }
  }

  // Fallback: if no files found, treat entire content as one file
  if (files.length === 0 && content.trim().length > 50) {
    files.push({
      filename: 'generated/page.ts',
      content: content.trim(),
      language: 'typescript',
    })
  }

  return files
}

function detectLang(filename: string): string {
  if (filename.endsWith('.wxml') || filename.endsWith('.axml') || filename.endsWith('.ttml')) return 'wxml'
  if (filename.endsWith('.wxss') || filename.endsWith('.acss') || filename.endsWith('.ttss')) return 'css'
  if (filename.endsWith('.json')) return 'json'
  if (filename.endsWith('.tsx')) return 'typescript'
  return 'typescript'
}

// ── 主组件 ──────────────────────────────────────────────────────────────────

export function VibePage({
  platform = 'weapp',
  apiKey: initialApiKey,
  model,
  baseUrl,
  onGenerate,
  theme = 'dark',
  lang = 'zh',
}: VibePageProps) {
  const [apiKey, setApiKey] = useState(initialApiKey || '')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentModel, setCurrentModel] = useState(model || 'anthropic/claude-3.5-sonnet')
  const [currentPlatform, setCurrentPlatform] = useState(platform)
  const [generating, setGenerating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleGenerate = useCallback(async () => {
    const prompt = input.trim()
    if (!prompt || generating) return
    if (!apiKey) {
      setShowSettings(true)
      return
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setGenerating(true)

    const assistantMsgId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      streaming: true,
      timestamp: Date.now(),
    }])

    abortRef.current = new AbortController()

    try {
      let fullContent = ''

      for await (const chunk of streamGenerate(
        apiKey,
        currentModel,
        prompt,
        currentPlatform,
        baseUrl
      )) {
        fullContent += chunk
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: fullContent }
            : m
        ))
      }

      const files = parseGeneratedFiles(fullContent)

      setMessages(prev => prev.map(m =>
        m.id === assistantMsgId
          ? { ...m, content: fullContent, files, streaming: false }
          : m
      ))

      if (files.length > 0) {
        onGenerate?.(files, currentPlatform)
      }

    } catch (err: any) {
      setMessages(prev => prev.map(m =>
        m.id === assistantMsgId
          ? { ...m, error: err.message || '生成失败', streaming: false }
          : m
      ))
    } finally {
      setGenerating(false)
    }
  }, [input, apiKey, generating, currentModel, currentPlatform, baseUrl, onGenerate])

  const stopGenerate = () => {
    abortRef.current?.abort()
    setGenerating(false)
    setMessages(prev => prev.map(m =>
      m.streaming ? { ...m, streaming: false } : m
    ))
  }

  const copyCode = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearChat = () => setMessages([])

  const isDark = theme === 'dark'
  const msgs = messages.filter(m => m.role !== 'system')

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: isDark ? '#0d1117' : '#f6f8fa',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: '13px',
      color: isDark ? '#e6edf3' : '#24292f',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px',
        borderBottom: `1px solid ${isDark ? '#21262d' : '#d0d7de'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: isDark ? '#161b22' : '#fff',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '18px' }}>✨</span>
        <span style={{ fontWeight: 700, fontSize: '15px', flex: 1 }}>
          VibePage · {lang === 'zh' ? 'AI 生成小程序页面' : 'AI Generate Mini-Program Pages'}
        </span>

        {/* Platform selector */}
        <select
          value={currentPlatform}
          onChange={e => setCurrentPlatform(e.target.value as any)}
          style={{
            background: isDark ? '#21262d' : '#f6f8fa',
            color: isDark ? '#e6edf3' : '#24292f',
            border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          <option value="weapp">微信小程序</option>
          <option value="alipay">支付宝小程序</option>
          <option value="douyin">抖音小程序</option>
          <option value="h5">H5 / Web</option>
        </select>

        {/* Model selector */}
        <select
          value={currentModel}
          onChange={e => setCurrentModel(e.target.value)}
          style={{
            background: isDark ? '#21262d' : '#f6f8fa',
            color: isDark ? '#e6edf3' : '#24292f',
            border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            maxWidth: '200px',
          }}
        >
          <optgroup label="Claude">
            <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
            <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
          </optgroup>
          <optgroup label="GPT">
            <option value="openai/gpt-4o">GPT-4o</option>
            <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
          </optgroup>
          <optgroup label="Gemini">
            <option value="google/gemini-2.0-flash">Gemini 2.0 Flash</option>
            <option value="google/gemini-pro">Gemini Pro</option>
          </optgroup>
          <optgroup label="其他">
            <option value="deepseek/deepseek-chat-v3">DeepSeek V3</option>
            <option value="qwen/qwen-2.5-72b-instruct">Qwen 2.5 72B</option>
          </optgroup>
        </select>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(s => !s)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px',
          }}
          title={lang === 'zh' ? '设置' : 'Settings'}
        >
          ⚙️
        </button>

        {/* Clear */}
        <button
          onClick={clearChat}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px',
          }}
          title={lang === 'zh' ? '清空' : 'Clear'}
        >
          🗑️
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${isDark ? '#21262d' : '#d0d7de'}`,
          background: isDark ? '#161b22' : '#fff',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '12px', color: isDark ? '#8b949e' : '#57606a' }}>
            {lang === 'zh' ? 'API Key (OpenRouter 兼容 OpenAI 格式)' : 'API Key (OpenRouter / OpenAI compatible)'}
          </span>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder={lang === 'zh' ? 'sk-or-...' : 'sk-or-...'}
            style={{
              flex: 1,
              minWidth: '200px',
              background: isDark ? '#0d1117' : '#f6f8fa',
              border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
              borderRadius: '6px',
              padding: '6px 10px',
              color: isDark ? '#e6edf3' : '#24292f',
              fontSize: '12px',
              fontFamily: 'inherit',
            }}
          />
          <span style={{ fontSize: '11px', color: isDark ? '#8b949e' : '#57606a' }}>
            {lang === 'zh' ? '支持 OpenRouter / OpenAI / Anthropic 等兼容 API' : 'Supports OpenRouter, OpenAI, Anthropic...'}
          </span>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {msgs.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '12px',
            color: isDark ? '#8b949e' : '#57606a',
          }}>
            <span style={{ fontSize: '48px' }}>✨</span>
            <div style={{ textAlign: 'center', maxWidth: '500px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                {lang === 'zh' ? 'VibePage - 用自然语言生成小程序页面' : 'VibePage - Generate Mini-Program Pages with Natural Language'}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                {lang === 'zh'
                  ? '描述你想要的页面，AI 立即生成完整源代码。试试：帮我做一个商品详情页、用户登录页、搜索结果页...'
                  : 'Describe the page you want, AI generates complete source code instantly. Try: product detail page, login page, search results...'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
              {[
                '帮我做一个商品详情页',
                '用户登录 + 注册页面',
                '搜索结果列表页',
                '个人中心设置页',
                '帮我做一个订单确认页',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  style={{
                    background: isDark ? '#21262d' : '#f6f8fa',
                    border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    color: isDark ? '#e6edf3' : '#24292f',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {msgs.map(msg => (
          <div key={msg.id} style={{ marginBottom: '20px' }}>
            {msg.role === 'user' && (
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  flexShrink: 0,
                }}>
                  👤
                </div>
                <div style={{
                  background: isDark ? '#1c2128' : '#fff',
                  border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                  borderRadius: '12px 12px 12px 4px',
                  padding: '10px 14px',
                  maxWidth: '75%',
                  lineHeight: 1.6,
                }}>
                  {msg.content}
                </div>
              </div>
            )}

            {msg.role === 'assistant' && (
              <div>
                {/* Status indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  color: isDark ? '#8b949e' : '#57606a',
                  fontSize: '12px',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #07c160 0%, #06ad56 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    flexShrink: 0,
                  }}>
                    ✨
                  </div>
                  <span>
                    {msg.streaming ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ animation: 'pulse 1s infinite' }}>⏳</span>
                        {lang === 'zh' ? '正在生成...' : 'Generating...'}
                      </span>
                    ) : msg.error ? (
                      <span style={{ color: '#f85149' }}>❌ {msg.error}</span>
                    ) : (
                      <span>✅ {lang === 'zh' ? '已生成' : 'Generated'}</span>
                    )}
                  </span>
                </div>

                {/* Error */}
                {msg.error && (
                  <div style={{
                    background: 'rgba(248, 81, 73, 0.1)',
                    border: '1px solid #f85149',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#f85149',
                    fontSize: '12px',
                    marginLeft: '38px',
                  }}>
                    {msg.error}
                  </div>
                )}

                {/* Code blocks */}
                {msg.files?.map((file, fi) => (
                  <div key={fi} style={{
                    marginLeft: '38px',
                    marginBottom: '12px',
                    border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}>
                    {/* File header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 14px',
                      background: isDark ? '#161b22' : '#f6f8fa',
                      borderBottom: `1px solid ${isDark ? '#21262d' : '#d0d7de'}`,
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#e6edf3' : '#24292f' }}>
                        {file.filename}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => copyCode(file.content, `${msg.id}-${fi}`)}
                          style={{
                            background: 'none',
                            border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            color: isDark ? '#8b949e' : '#57606a',
                          }}
                        >
                          {copiedId === `${msg.id}-${fi}` ? '✅' : '📋'} {lang === 'zh' ? '复制' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    {/* Code content */}
                    <CodeBlock code={file.content} language={file.language} isDark={isDark} />
                  </div>
                ))}

                {/* Streaming text (before files are parsed) */}
                {msg.streaming && msg.content && !msg.files?.length && (
                  <div style={{
                    marginLeft: '38px',
                    background: isDark ? '#161b22' : '#fff',
                    border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                    borderRadius: '8px',
                    padding: '14px',
                    maxWidth: '85%',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    color: isDark ? '#e6edf3' : '#24292f',
                  }}>
                    {msg.content}
                    <span style={{ animation: 'blink 1s infinite', color: '#07c160' }}>▊</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 20px',
        borderTop: `1px solid ${isDark ? '#21262d' : '#d0d7de'}`,
        background: isDark ? '#161b22' : '#fff',
        flexShrink: 0,
      }}>
        {!apiKey && (
          <div style={{
            fontSize: '12px',
            color: '#f0a020',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            ⚠️ {lang === 'zh' ? '请先在设置中填入 API Key（点击右上角 ⚙️）' : 'Please add your API Key in settings (click ⚙️ top right)'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleGenerate()
              }
            }}
            placeholder={lang === 'zh'
              ? '描述你想生成的小程序页面... (Enter 发送，Shift+Enter 换行)'
              : 'Describe the mini-program page you want... (Enter to send)'}
            rows={1}
            style={{
              flex: 1,
              background: isDark ? '#0d1117' : '#f6f8fa',
              border: `1px solid ${!apiKey ? '#f0a020' : isDark ? '#30363d' : '#d0d7de'}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: isDark ? '#e6edf3' : '#24292f',
              fontSize: '13px',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              minHeight: '44px',
              maxHeight: '160px',
              overflowY: 'auto',
            }}
          />
          {generating ? (
            <button
              onClick={stopGenerate}
              style={{
                background: '#f85149',
                border: 'none',
                borderRadius: '8px',
                width: '44px',
                height: '44px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={lang === 'zh' ? '停止' : 'Stop'}
            >
              ⏹
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!input.trim() || !apiKey}
              style={{
                background: apiKey && input.trim() ? '#07c160' : '#21262d',
                border: 'none',
                borderRadius: '8px',
                width: '44px',
                height: '44px',
                cursor: apiKey && input.trim() ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: apiKey && input.trim() ? 1 : 0.5,
              }}
              title={lang === 'zh' ? '生成' : 'Generate'}
            >
              ✨
            </button>
          )}
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ── 代码高亮（简单实现）──────────────────────────────────────────────────────

function CodeBlock({ code, language, isDark }: {
  code: string
  language: string
  isDark: boolean
}) {
  const highlighted = highlightCode(code, language)

  return (
    <div style={{
      background: isDark ? '#0d1117' : '#fff',
      overflow: 'auto',
      maxHeight: '400px',
    }}>
      <pre style={{
        margin: 0,
        padding: '14px',
        fontSize: '12px',
        lineHeight: 1.7,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        whiteSpace: 'pre',
        color: isDark ? '#e6edf3' : '#24292f',
      }}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  )
}

// 简单的代码高亮
function highlightCode(code: string, language: string): string {
  if (!code) return ''

  // Escape HTML first
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Comments (// or /* */ or #)
  result = result.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|# [^\n]*)/g,
    '<span style="color:#8b949e;font-style:italic">$1</span>')

  // Strings
  result = result.replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g,
    '<span style="color:#a5d6ff">$1</span>')

  // Keywords
  const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function',
    'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'async',
    'await', 'new', 'this', 'extends', 'implements', 'default', 'Page', 'Component',
    'useState', 'useEffect', 'useUniState', 'useUniRouter', 'useUniRequest']
  for (const kw of keywords) {
    result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'),
      '<span style="color:#ff7b72;font-weight:600">$1</span>')
  }

  // Properties
  result = result.replace(/(\w+)(?=\s*:(?![:]))/g,
    '<span style="color:#79c0ff">$1</span>')

  // Numbers
  result = result.replace(/\b(\d+(?:\.\d+)?)\b/g,
    '<span style="color:#ffa657">$1</span>')

  return result
}
