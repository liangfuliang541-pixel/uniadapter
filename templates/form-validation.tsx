/**
 * VibeHub Template: Form Validation
 * 表单验证模板 - 包含多种验证规则和错误提示
 *
 * Usage: uniadapter template add form-validation
 */
import { View, Text, Input, Textarea, Picker } from '@tarojs/components'
import { Button } from '@liangfu/uniadapter'
import { useState, useCallback } from 'react'

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  gender: string
  age: string
}

interface ValidationErrors {
  name?: string
  email?: string
  phone?: string
  address?: string
  gender?: string
  age?: string
}

interface FormValidationPageProps {
  onSubmit?: (data: FormData) => void
  onCancel?: () => void
}

export function FormValidationPage({ onSubmit, onCancel }: FormValidationPageProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    age: ''
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // 验证规则
  const validators = {
    name: (value: string) => {
      if (!value.trim()) return '姓名不能为空'
      if (value.length < 2) return '姓名至少2个字符'
      if (value.length > 20) return '姓名不能超过20个字符'
      return ''
    },
    email: (value: string) => {
      if (!value.trim()) return '邮箱不能为空'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return '请输入有效的邮箱地址'
      return ''
    },
    phone: (value: string) => {
      if (!value.trim()) return '手机号不能为空'
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(value)) return '请输入有效的11位手机号'
      return ''
    },
    address: (value: string) => {
      if (!value.trim()) return '地址不能为空'
      if (value.length < 5) return '地址至少5个字符'
      if (value.length > 200) return '地址不能超过200个字符'
      return ''
    },
    gender: (value: string) => {
      if (!value) return '请选择性别'
      return ''
    },
    age: (value: string) => {
      if (!value) return '请选择年龄段'
      return ''
    }
  }

  // 实时验证
  const validateField = useCallback((field: keyof FormData, value: string) => {
    const error = validators[field](value)
    setErrors(prev => ({ ...prev, [field]: error }))
    return !error
  }, [])

  // 字段改变处理
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validateField(field, value)
    }
  }

  // 字段失焦处理
  const handleFieldBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  // 表单整体验证
  const validateForm = () => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(formData).forEach(key => {
      const field = key as keyof FormData
      const error = validators[field](formData[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      gender: true,
      age: true
    })

    return isValid
  }

  // 提交处理
  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSubmit?.(formData)
    } finally {
      setLoading(false)
    }
  }

  const genderOptions = ['男', '女', '其他']
  const ageOptions = ['18岁以下', '18-25岁', '26-35岁', '36-45岁', '46岁以上']

  return (
    <View className="form-validation-page">
      <View className="form-header">
        <Text className="form-title">用户信息表单</Text>
        <Text className="form-subtitle">请填写完整信息，我们将为您提供更好的服务</Text>
      </View>

      <View className="form-content">
        {/* 姓名 */}
        <View className="form-group">
          <Text className="form-label">姓名 *</Text>
          <Input
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="请输入您的姓名"
            value={formData.name}
            onInput={(e: any) => handleFieldChange('name', e.detail.value)}
            onBlur={() => handleFieldBlur('name')}
          />
          {errors.name && <Text className="error-text">{errors.name}</Text>}
        </View>

        {/* 邮箱 */}
        <View className="form-group">
          <Text className="form-label">邮箱 *</Text>
          <Input
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="请输入邮箱地址"
            type="email"
            value={formData.email}
            onInput={(e: any) => handleFieldChange('email', e.detail.value)}
            onBlur={() => handleFieldBlur('email')}
          />
          {errors.email && <Text className="error-text">{errors.email}</Text>}
        </View>

        {/* 手机号 */}
        <View className="form-group">
          <Text className="form-label">手机号 *</Text>
          <Input
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="请输入11位手机号"
            type="number"
            maxlength={11}
            value={formData.phone}
            onInput={(e: any) => handleFieldChange('phone', e.detail.value)}
            onBlur={() => handleFieldBlur('phone')}
          />
          {errors.phone && <Text className="error-text">{errors.phone}</Text>}
        </View>

        {/* 性别 */}
        <View className="form-group">
          <Text className="form-label">性别 *</Text>
          <Picker
            mode="selector"
            range={genderOptions}
            value={genderOptions.indexOf(formData.gender)}
            onChange={(e: any) => handleFieldChange('gender', genderOptions[e.detail.value])}
          >
            <View className={`form-picker ${errors.gender ? 'error' : ''}`}>
              <Text className={formData.gender ? 'picker-text' : 'picker-placeholder'}>
                {formData.gender || '请选择性别'}
              </Text>
            </View>
          </Picker>
          {errors.gender && <Text className="error-text">{errors.gender}</Text>}
        </View>

        {/* 年龄段 */}
        <View className="form-group">
          <Text className="form-label">年龄段 *</Text>
          <Picker
            mode="selector"
            range={ageOptions}
            value={ageOptions.indexOf(formData.age)}
            onChange={(e: any) => handleFieldChange('age', ageOptions[e.detail.value])}
          >
            <View className={`form-picker ${errors.age ? 'error' : ''}`}>
              <Text className={formData.age ? 'picker-text' : 'picker-placeholder'}>
                {formData.age || '请选择年龄段'}
              </Text>
            </View>
          </Picker>
          {errors.age && <Text className="error-text">{errors.age}</Text>}
        </View>

        {/* 地址 */}
        <View className="form-group">
          <Text className="form-label">地址 *</Text>
          <Textarea
            className={`form-textarea ${errors.address ? 'error' : ''}`}
            placeholder="请输入详细地址"
            value={formData.address}
            onInput={(e: any) => handleFieldChange('address', e.detail.value)}
            onBlur={() => handleFieldBlur('address')}
            maxlength={200}
            autoHeight
          />
          {errors.address && <Text className="error-text">{errors.address}</Text>}
        </View>
      </View>

      <View className="form-actions">
        <Button
          className="cancel-btn"
          onClick={onCancel}
          disabled={loading}
        >
          取消
        </Button>
        <Button
          className="submit-btn"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          提交
        </Button>
      </View>
    </View>
  )
}