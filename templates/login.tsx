/**
 * VibeHub Template: Login Page
 * 登录页 - 手机号 + 验证码登录
 * 
 * Usage: uniadapter template add login
 */
import { View, Text, Input, Image } from '@tarojs/components'
import { Button } from '@liangfu/uniadapter'
import { useState } from 'react'

interface LoginPageProps {
  onLogin?: (phone: string, code: string) => void
  onWechatLogin?: () => void
  onRegister?: () => void
}

export function LoginPage({ onLogin, onWechatLogin, onRegister }: LoginPageProps) {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  const sendCode = () => {
    if (!phone || phone.length !== 11) return
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleLogin = async () => {
    if (!phone || !code || !agreed) return
    setLoading(true)
    try {
      await onLogin?.(phone, code)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="login-page">
      {/* Logo */}
      <View className="logo-section">
        <View className="logo-placeholder">
          <Text className="logo-text">V</Text>
        </View>
        <Text className="app-name">欢迎回来</Text>
        <Text className="app-slogan">登录后体验更多功能</Text>
      </View>

      {/* Form */}
      <View className="form-section">
        {/* Phone */}
        <View className="input-group">
          <Text className="input-label">+86</Text>
          <Input
            className="input-field"
            type="number"
            maxlength={11}
            placeholder="请输入手机号"
            value={phone}
            onInput={e => setPhone(e.detail.value)}
          />
        </View>

        {/* Verification Code */}
        <View className="input-group">
          <Input
            className="input-field code-field"
            type="number"
            maxlength={6}
            placeholder="请输入验证码"
            value={code}
            onInput={e => setCode(e.detail.value)}
          />
          <Button
            size="small"
            plain
            disabled={countdown > 0 || phone.length !== 11}
            onClick={sendCode}
          >
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </Button>
        </View>

        {/* Agreement */}
        <View className="agreement-row" onClick={() => setAgreed(!agreed)}>
          <View className={`checkbox ${agreed ? 'checked' : ''}`}>
            {agreed && <Text className="check-icon">✓</Text>}
          </View>
          <Text className="agreement-text">
            我已阅读并同意
            <Text className="link">《用户协议》</Text>
            和
            <Text className="link">《隐私政策》</Text>
          </Text>
        </View>

        {/* Login Button */}
        <Button
          type="primary"
          size="large"
          block
          disabled={!phone || !code || !agreed}
          loading={loading}
          onClick={handleLogin}
        >
          登录
        </Button>

        {/* Divider */}
        <View className="divider">
          <View className="divider-line" />
          <Text className="divider-text">其他登录方式</Text>
          <View className="divider-line" />
        </View>

        {/* Wechat Login */}
        <Button
          type="default"
          size="large"
          block
          onClick={onWechatLogin}
        >
          <Text className="btn-icon">🟢</Text>
          微信一键登录
        </Button>

        {/* Register Link */}
        <View className="register-row">
          <Text className="register-text">还没有账号？</Text>
          <Text className="register-link" onClick={onRegister}>立即注册</Text>
        </View>
      </View>

      {/* Styles */}
      <style>{`
        .login-page { padding: 48px 24px; min-height: 100vh; background: #fff; }
        .logo-section { text-align: center; margin-bottom: 48px; }
        .logo-placeholder { width: 72px; height: 72px; border-radius: 16px; background: linear-gradient(135deg, #07c160, #10b981); margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; }
        .logo-text { font-size: 36px; font-weight: 700; color: #fff; }
        .app-name { display: block; font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; }
        .app-slogan { font-size: 14px; color: #999; }
        .form-section { display: flex; flex-direction: column; gap: 16px; }
        .input-group { display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 12px 0; }
        .input-label { font-size: 16px; color: #1a1a1a; margin-right: 12px; font-weight: 500; }
        .input-field { flex: 1; font-size: 16px; }
        .code-field { flex: 1; }
        .agreement-row { display: flex; align-items: flex-start; gap: 8px; padding: 8px 0; }
        .checkbox { width: 18px; height: 18px; border: 1px solid #ddd; border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
        .checkbox.checked { background: #07c160; border-color: #07c160; }
        .check-icon { color: #fff; font-size: 12px; font-weight: 700; }
        .agreement-text { font-size: 13px; color: #666; line-height: 1.5; }
        .link { color: #07c160; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 8px 0; }
        .divider-line { flex: 1; height: 1px; background: #eee; }
        .divider-text { font-size: 12px; color: #999; white-space: nowrap; }
        .btn-icon { margin-right: 6px; }
        .register-row { text-align: center; margin-top: 16px; }
        .register-text { font-size: 14px; color: #999; }
        .register-link { font-size: 14px; color: #07c160; margin-left: 4px; font-weight: 500; }
      `}</style>
    </View>
  )
}
