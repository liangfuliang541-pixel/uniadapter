/**
 * VibeUI Component Registry
 * 首个 shadcn 风格的小程序组件注册表
 *
 * 核心理念：组件不是安装的包，而是你拥有的源代码
 *
 * @example
 * import { VibeUI } from '@liangfu/uniadapter'
 * const vibeui = new VibeUI()
 * vibeui.generate(['button', 'card'], 'weapp')
 */

export { VibeUI, type ComponentName, type ComponentPlatform, type ComponentEntry }
export { presetComponents, allComponentNames }
export { type ComponentSource, type ComponentFile }

import { Platform } from '../../core/types/platform'

// ── 类型 ─────────────────────────────────────────────────────────────────────

type ComponentName =
  | 'button' | 'input' | 'textarea' | 'card' | 'list' | 'list-item'
  | 'dialog' | 'modal' | 'toast' | 'action-sheet'
  | 'nav-bar' | 'tab-bar' | 'search-bar' | 'avatar' | 'badge'
  | 'tag' | 'divider' | 'skeleton' | 'empty' | 'loading'
  | 'swiper' | 'picker' | 'switch' | 'checkbox' | 'radio' | 'rate'

type ComponentPlatform = 'h5' | 'weapp' | 'alipay' | 'douyin' | 'xiaohongshu' | 'amap' | 'reactnative'

type Category = 'form' | 'layout' | 'feedback' | 'navigation' | 'data' | 'media'

interface ComponentEntry {
  name: ComponentName
  label: string
  description: string
  category: Category
  shadcnEquivalent?: string
  popularity?: number
  files: Partial<Record<ComponentPlatform, string>>
  dependencies?: ComponentName[]
}

// ── 注册表 ───────────────────────────────────────────────────────────────────

const _registry: ComponentEntry[] = [
  { name: 'button', label: '按钮', description: '触发操作的基础交互组件，支持多种变体和尺寸。', category: 'form', shadcnEquivalent: 'Button', popularity: 9800, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'input', label: '输入框', description: '单行文本输入，支持前缀图标、清除按钮、错误提示。', category: 'form', shadcnEquivalent: 'Input', popularity: 9200, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'textarea', label: '多行输入', description: '多行文本输入，自动增高，支持字数统计。', category: 'form', shadcnEquivalent: 'Textarea', popularity: 8700, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'card', label: '卡片', description: '承载内容的卡片容器，支持标题、描述、操作区域。', category: 'layout', shadcnEquivalent: 'Card', popularity: 9100, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'list', label: '列表', description: '高性能虚拟列表，支持下拉刷新、上拉加载更多。', category: 'data', shadcnEquivalent: 'DataTable', popularity: 8900, files: { h5: '', weapp: '', alipay: '', douyin: '' }, dependencies: ['list-item'] },
  { name: 'list-item', label: '列表项', description: '列表行组件，支持左图右文、左文右图、宫格等多种布局。', category: 'data', popularity: 8500, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'dialog', label: '对话框', description: '模态弹窗，支持自定义标题、内容、按钮组。', category: 'feedback', shadcnEquivalent: 'Dialog', popularity: 9300, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'modal', label: '底部弹窗', description: '从底部弹出的操作面板，常用于分享、选择等场景。', category: 'feedback', popularity: 8600, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'toast', label: '轻提示', description: '短暂提示信息，自动消失，支持成功/失败/加载等状态。', category: 'feedback', shadcnEquivalent: 'Sonner', popularity: 9500, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'action-sheet', label: '操作菜单', description: '底部弹出操作选项列表，类似微信"更多"菜单。', category: 'feedback', popularity: 8400, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'nav-bar', label: '导航栏', description: '页面顶部导航栏，支持标题、返回按钮、右侧操作区。', category: 'navigation', shadcnEquivalent: 'NavigationMenu', popularity: 8800, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'tab-bar', label: '标签栏', description: '底部 Tab 切换栏，支持徽标、红点、隐藏等功能。', category: 'navigation', shadcnEquivalent: 'Tabs', popularity: 8900, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'search-bar', label: '搜索框', description: '搜索输入组件，支持历史记录、热词推荐、实时搜索。', category: 'navigation', popularity: 8200, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'avatar', label: '头像', description: '用户头像展示，支持默认图、形状（圆/方）、尺寸、群头像。', category: 'data', shadcnEquivalent: 'Avatar', popularity: 8100, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'badge', label: '徽标', description: '小红点或数字徽章，用于通知数量、状态提示。', category: 'data', shadcnEquivalent: 'Badge', popularity: 7800, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'tag', label: '标签', description: '用于分类、筛选的标签组件，支持可选中、可删除。', category: 'data', popularity: 7900, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'divider', label: '分割线', description: '内容区域分隔线，支持水平/垂直、虚线/实线。', category: 'layout', popularity: 7500, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'skeleton', label: '骨架屏', description: '内容加载占位动画，提升感知加载速度。', category: 'feedback', shadcnEquivalent: 'Skeleton', popularity: 8300, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'empty', label: '空状态', description: '无数据时的占位展示，支持图片、描述、行动按钮。', category: 'feedback', popularity: 7700, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'loading', label: '加载指示器', description: '全屏/局部加载状态，支持骨架屏、旋转图标、进度条。', category: 'feedback', popularity: 8600, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'switch', label: '开关', description: '二进制切换控件，常用于设置项。', category: 'form', shadcnEquivalent: 'Switch', popularity: 8000, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'checkbox', label: '复选框', description: '多选项控件，支持全选、禁用、半选状态。', category: 'form', shadcnEquivalent: 'Checkbox', popularity: 8100, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'radio', label: '单选框', description: '单选项控件，支持横向/纵向布局。', category: 'form', shadcnEquivalent: 'RadioGroup', popularity: 8000, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'swiper', label: '轮播图', description: '图片/内容轮播，支持自动播放、指示器、循环。', category: 'media', popularity: 8700, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'picker', label: '选择器', description: '多列选择器，支持日期、省市区、任意列联动。', category: 'form', shadcnEquivalent: 'Select', popularity: 8800, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
  { name: 'rate', label: '评分', description: '星级评分组件，支持半星、自定义图标。', category: 'form', popularity: 7600, files: { h5: '', weapp: '', alipay: '', douyin: '' } },
]

const _registryMap = new Map<ComponentName, ComponentEntry>(
  _registry.map(e => [e.name, e])
)

const presetComponents: ComponentName[] = [
  'button', 'input', 'card', 'dialog', 'toast', 'loading', 'empty', 'badge', 'tag', 'divider',
]

const _presetComponents: ComponentName[] = [
  'button', 'input', 'card', 'dialog', 'toast', 'loading', 'empty', 'badge', 'tag', 'divider',
]

const allComponentNames: ComponentName[] = [..._registry.map(e => e.name)]

// ── ComponentSource ──────────────────────────────────────────────────────────

interface ComponentFile {
  path: string
  content: string
  language: 'typescript' | 'javascript' | 'wxml' | 'axml' | 'css' | 'json'
}

interface ComponentSource {
  name: ComponentName
  platform: ComponentPlatform
  files: ComponentFile[]
  dependencies: ComponentName[]
  description: string
}

// ── 代码生成器 ──────────────────────────────────────────────────────────────

function generateComponentSource(
  name: ComponentName,
  platform: ComponentPlatform,
  outDir: string,
  ts: boolean
): ComponentSource {
  const entry = _registryMap.get(name)!
  const files: ComponentFile[] = []
  const dir = outDir + '/' + name

  if (platform === 'h5') {
    files.push({ path: dir + '/index.tsx', language: 'typescript', content: generateH5(name, entry) })
    files.push({ path: dir + '/styles.css', language: 'css', content: generateH5Styles(name) })
  } else if (platform === 'weapp') {
    files.push({ path: dir + '/index.ts', language: 'typescript', content: generateWeapp(name, entry, ts) })
    files.push({ path: dir + '/index.wxml', language: 'wxml', content: generateWeappWxml(name) })
    files.push({ path: dir + '/index.wxss', language: 'css', content: generateWxss(name) })
    files.push({ path: dir + '/index.json', language: 'json', content: generateJson(name) })
  } else if (platform === 'alipay') {
    files.push({ path: dir + '/index.ts', language: 'typescript', content: generateAlipay(name, entry, ts) })
    files.push({ path: dir + '/index.axml', language: 'axml', content: generateWeappWxml(name) })
    files.push({ path: dir + '/index.acss', language: 'css', content: generateWxss(name) })
    files.push({ path: dir + '/index.json', language: 'json', content: generateJson(name) })
  } else if (platform === 'douyin') {
    files.push({ path: dir + '/index.ts', language: 'typescript', content: generateDouyin(name, entry, ts) })
    files.push({ path: dir + '/index.ttml', language: 'wxml', content: generateWeappWxml(name) })
    files.push({ path: dir + '/index.ttss', language: 'css', content: generateWxss(name) })
    files.push({ path: dir + '/index.json', language: 'json', content: generateJson(name) })
  }

  return { name, platform, files, dependencies: entry.dependencies || [], description: entry.description }
}

// ── H5 代码 ─────────────────────────────────────────────────────────────────

function generateH5(name: ComponentName, entry: ComponentEntry): string {
  const capName = name.charAt(0).toUpperCase() + name.slice(1)
  const imports: Record<ComponentName, string> = {
    button: "import './styles.css'\nexport interface ButtonProps { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'small' | 'medium' | 'large'; disabled?: boolean; loading?: boolean; onClick?: () => void; children?: React.ReactNode }\nexport function Button({ variant = 'primary', size = 'medium', disabled = false, loading = false, onClick, children }: ButtonProps) { return <button className={`vui-btn vui-btn--${variant} vui-btn--${size} ${disabled ? 'vui-btn--disabled' : ''}`} disabled={disabled || loading} onClick={onClick}>{loading ? '加载中' : children}</button> }",
    card: "import './styles.css'\nexport interface CardProps { title?: string; subtitle?: string; children?: React.ReactNode; className?: string }\nexport function Card({ title, subtitle, children, className = '' }: CardProps) { return <div className={`vui-card ${className}`}>{title && <div className='vui-card__header'><h3 className='vui-card__title'>{title}</h3>{subtitle && <p className='vui-card__subtitle'>{subtitle}</p>}</div>}<div className='vui-card__body'>{children}</div></div> }",
    input: "import './styles.css'\nexport interface InputProps { placeholder?: string; value?: string; onChange?: (v: string) => void; disabled?: boolean; type?: string }\nexport function Input({ placeholder = '', value = '', onChange, disabled = false, type = 'text' }: InputProps) { return <input className='vui-input' type={type} placeholder={placeholder} value={value} onChange={e => onChange?.(e.target.value)} disabled={disabled} /> }",
  }
  return imports[name] || `// ${entry.label} - H5 组件\nimport './styles.css'\nexport function ${capName}(props: any) { return <div className="vui-${name}">{props.children}</div> }`
}

function generateH5Styles(name: ComponentName): string {
  return [
    `/* ${name} - VibeUI H5 Styles */`,
    `.vui-${name} { /* custom styles here */ }`,
    `.vui-btn { display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; transition: all 0.15s ease; }`,
    `.vui-btn--primary { background: #07c160; color: #fff; }`,
    `.vui-btn--secondary { background: #576a95; color: #fff; }`,
    `.vui-btn--ghost { border: 1px solid #ddd; background: transparent; color: #333; }`,
    `.vui-btn--danger { background: #fa5151; color: #fff; }`,
    `.vui-btn--small { font-size: 12px; padding: 6px 12px; }`,
    `.vui-btn--medium { font-size: 14px; padding: 8px 16px; }`,
    `.vui-btn--large { font-size: 16px; padding: 12px 24px; }`,
    `.vui-btn--disabled { opacity: 0.5; cursor: not-allowed; }`,
    `.vui-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }`,
    `.vui-card__header { padding: 24px 24px 0; }`,
    `.vui-card__title { font-size: 18px; font-weight: 600; margin: 0; }`,
    `.vui-card__subtitle { font-size: 14px; color: #666; margin: 4px 0 0; }`,
    `.vui-card__body { padding: 24px; }`,
    `.vui-input { width: 100%; padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; }`,
    `.vui-input:focus { border-color: #07c160; }`,
  ].join('\n')
}

// ── 微信小程序代码 ──────────────────────────────────────────────────────────

function generateWeapp(name: ComponentName, entry: ComponentEntry, ts: boolean): string {
  if (ts) {
    return [
      `// ${entry.label} - 微信小程序组件`,
      `// VibeUI Component | ${entry.description}`,
      `// 自动生成，可自由定制`,
      '',
      `Component({`,
      `  properties: {`,
      `    variant: { type: String, value: 'primary' },`,
      `    size: { type: String, value: 'medium' },`,
      `    disabled: { type: Boolean, value: false },`,
      `    loading: { type: Boolean, value: false },`,
      `  },`,
      '',
      `  data: {},`,
      '',
      `  methods: {`,
      `    onTap() {`,
      `      if (this.data.disabled || this.data.loading) return`,
      `      this.triggerEvent('click')`,
      `    },`,
      `  },`,
      `})`,
    ].join('\n')
  } else {
    return [
      `// ${entry.label} - 微信小程序组件`,
      `// VibeUI Component | ${entry.description}`,
      '',
      `Component({`,
      `  properties: {`,
      `    variant: { type: String, value: 'primary' },`,
      `    size: { type: String, value: 'medium' },`,
      `    disabled: { type: Boolean, value: false },`,
      `    loading: { type: Boolean, value: false },`,
      `  },`,
      '',
      `  data: {},`,
      '',
      `  methods: {`,
      `    onTap() {`,
      `      if (this.data.disabled || this.data.loading) return`,
      `      this.triggerEvent('click')`,
      `    },`,
      `  },`,
      `})`,
    ].join('\n')
  }
}

function generateWeappWxml(name: ComponentName): string {
  const wxmlMap: Record<string, string> = {
    button: '<button class="vui-btn vui-btn--{{variant}} vui-btn--{{size}}" disabled="{{disabled}}" loading="{{loading}}" bindtap="onTap"><slot wx:if="{{!loading}}" /><text wx:if="{{loading}}">加载中</text></button>',
    card: '<view class="vui-card"><view wx:if="{{title}}" class="vui-card__header"><text class="vui-card__title">{{title}}</text></view><view class="vui-card__body"><slot /></view></view>',
    input: '<view class="vui-input-wrapper"><input class="vui-input" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}" disabled="{{disabled}}" bindinput="onInput" /></view>',
    list: '<scroll-view class="vui-list" scroll-y lower-threshold="50" bindscrolltolower="onLoadMore"><slot /></scroll-view>',
    'list-item': '<view class="vui-list-item" bindtap="onTap"><image wx:if="{{thumb}}" class="vui-list-item__thumb" src="{{thumb}}" /><view class="vui-list-item__content"><text class="vui-list-item__title">{{title}}</text><text wx:if="{{desc}}" class="vui-list-item__desc">{{desc}}</text></view><text wx:if="{{extra}}" class="vui-list-item__extra">{{extra}}</text></view>',
    dialog: '<view wx:if="{{visible}}" class="vui-dialog__mask" bindtap="onMaskTap"><view class="vui-dialog"><view wx:if="{{title}}" class="vui-dialog__header"><text>{{title}}</text></view><view class="vui-dialog__body"><slot /></view></view></view>',
    toast: '<view wx:if="{{visible}}" class="vui-toast vui-toast--{{type}}"><text>{{message}}</text></view>',
    'nav-bar': '<view class="vui-nav-bar" style="padding-top: {{statusBarHeight}}px"><view class="vui-nav-bar__inner"><view wx:if="{{showBack}}" class="vui-nav-bar__back" bindtap="onBack">‹</view><view class="vui-nav-bar__title"><slot>{{title}}</slot></view></view></view>',
    'tab-bar': '<view class="vui-tab-bar"><view wx:for="{{tabs}}" wx:key="key" class="vui-tab-bar__item {{active === item.key ? \'active\' : \'\'}}" bindtap="onChange"><text wx:if="{{item.badge}}" class="vui-tab-bar__badge">{{item.badge}}</text><text>{{item.text}}</text></view></view>',
    badge: '<view class="vui-badge"><slot /><text wx:if="{{value && !dot}}" class="vui-badge__text">{{value > 99 ? \'99+\' : value}}</text></view>',
    tag: '<view class="vui-tag vui-tag--{{type}}"><slot>{{text}}</slot></view>',
    skeleton: '<view class="vui-skeleton"><view wx:if="{{avatar}}" class="vui-skeleton__avatar" /><view class="vui-skeleton__content"><view wx:if="{{title}}" class="vui-skeleton__title" /><view class="vui-skeleton__row" /></view></view>',
    empty: '<view class="vui-empty"><text wx:if="{{!image}}" class="vui-empty__icon">{{icon || \'📭\'}}</text><text class="vui-empty__desc">{{description || \'暂无数据\'}}</text><slot /></view>',
    loading: '<view class="vui-loading vui-loading--{{type}}"><view wx:if="{{type === \'spinner\'}}" class="vui-loading__spinner"><view wx:for="{{12}}" wx:key="index" class="vui-loading__dot" /></view><text wx:if="{{text}}" class="vui-loading__text">{{text}}</text></view>',
    switch: '<view class="vui-switch {{checked ? \'on\' : \'off\'}}" bindtap="onTap"><view class="vui-switch__node" /></view>',
    checkbox: '<view class="vui-checkbox {{checked ? \'checked\' : \'\'}}" bindtap="onTap"><text wx:if="{{checked}}">✓</text><text wx:if="{{label}}">{{label}}</text></view>',
    radio: '<view class="vui-radio {{checked ? \'checked\' : \'\'}}" bindtap="onTap"><view class="vui-radio__dot" /><text wx:if="{{label}}">{{label}}</text></view>',
    swiper: '<swiper class="vui-swiper" indicator-dots autoplay circular><swiper-item wx:for="{{images}}" wx:key="index"><image src="{{item}}" class="vui-swiper__img" mode="aspectFill" /></swiper-item></swiper>',
    picker: '<view class="vui-picker" bindtap="onOpen"><text>{{displayValue || placeholder || \'请选择\'}}</text><text>›</text></view>',
    rate: '<view class="vui-rate"><view wx:for="{{5}}" wx:key="index" class="vui-rate__star {{index < value ? \'active\' : \'\'}}" bindtap="onSelect">{{index < value ? \'★\' : \'☆\'}}</view></view>',
    divider: '<view class="vui-divider"><text wx:if="{{label}}" class="vui-divider__label">{{label}}</text></view>',
    avatar: '<view class="vui-avatar vui-avatar--{{size}}"><image wx:if="{{src}}" class="vui-avatar__img" src="{{src}}" /><text wx:else class="vui-avatar__fallback">{{name ? name.charAt(0) : \'?\'}}</text></view>',
    modal: '<view wx:if="{{visible}}" class="vui-modal__mask" bindtap="onMaskTap"><view class="vui-modal"><view wx:if="{{title}}" class="vui-modal__header"><text>{{title}}</text></view><view class="vui-modal__body"><slot /></view></view></view>',
    'action-sheet': '<view wx:if="{{visible}}" class="vui-action-sheet__mask" bindtap="onCancel"><view class="vui-action-sheet"><view wx:for="{{actions}}" wx:key="key" class="vui-action-sheet__item" bindtap="onSelect">{{item.text}}</view><view class="vui-action-sheet__cancel" bindtap="onCancel">取消</view></view></view>',
    'search-bar': '<view class="vui-search-bar"><view class="vui-search-bar__input-wrap"><text class="vui-search-bar__icon">🔍</text><input class="vui-search-bar__input" placeholder="{{placeholder || \'搜索\'}}" value="{{value}}" bindinput="onInput" bindconfirm="onSearch" /><text wx:if="{{value}}" class="vui-search-bar__clear" bindtap="onClear">×</text></view><text wx:if="{{showCancel}}" class="vui-search-bar__cancel" bindtap="onCancel">取消</text></view>',
    textarea: '<view class="vui-textarea-wrapper"><textarea class="vui-textarea" placeholder="{{placeholder}}" value="{{value}}" disabled="{{disabled}}" maxlength="{{maxLength || -1}}" bindinput="onInput" /><text wx:if="{{showCount}}" class="vui-textarea__count">{{value?.length || 0}}/{{maxLength}}</text></view>',
  }
  return wxmlMap[name] || '<view class="vui-' + name + '"><slot /></view>'
}

function generateWxss(name: ComponentName): string {
  return [
    `/* ${name} - VibeUI 微信小程序样式 */`,
    `.vui-btn { display: flex; align-items: center; justify-content: center; border-radius: 8rpx; }`,
    `.vui-btn--primary { background: #07c160; color: #fff; }`,
    `.vui-btn--secondary { background: #576a95; color: #fff; }`,
    `.vui-btn--ghost { border: 1rpx solid #ddd; background: transparent; color: #333; }`,
    `.vui-btn--danger { background: #fa5151; color: #fff; }`,
    `.vui-btn--small { font-size: 24rpx; padding: 16rpx 24rpx; }`,
    `.vui-btn--medium { font-size: 28rpx; padding: 20rpx 32rpx; }`,
    `.vui-btn--large { font-size: 32rpx; padding: 24rpx 40rpx; }`,
    `.vui-btn--disabled { opacity: 0.5; }`,
    `.vui-card { background: #fff; border-radius: 16rpx; overflow: hidden; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.08); }`,
    `.vui-card__header { padding: 32rpx 32rpx 0; }`,
    `.vui-card__title { font-size: 32rpx; font-weight: 600; }`,
    `.vui-card__body { padding: 32rpx; }`,
    `.vui-input-wrapper { display: flex; align-items: center; padding: 16rpx 24rpx; background: #f7f7f7; border-radius: 8rpx; }`,
    `.vui-input { flex: 1; font-size: 28rpx; }`,
    `.vui-list-item { display: flex; align-items: center; padding: 24rpx 32rpx; background: #fff; border-bottom: 1rpx solid #f0f0f0; }`,
    `.vui-list-item__thumb { width: 96rpx; height: 96rpx; border-radius: 8rpx; margin-right: 24rpx; }`,
    `.vui-list-item__content { flex: 1; }`,
    `.vui-list-item__title { font-size: 30rpx; color: #333; }`,
    `.vui-list-item__desc { font-size: 26rpx; color: #999; margin-top: 8rpx; }`,
    `.vui-list-item__extra { color: #999; font-size: 28rpx; }`,
    `.vui-dialog__mask { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }`,
    `.vui-dialog { background: #fff; border-radius: 24rpx; width: 560rpx; max-width: 90vw; }`,
    `.vui-dialog__header { padding: 40rpx 40rpx 0; font-size: 34rpx; font-weight: 600; text-align: center; }`,
    `.vui-dialog__body { padding: 40rpx; font-size: 30rpx; }`,
    `.vui-toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 24rpx 48rpx; background: rgba(0,0,0,0.75); color: #fff; border-radius: 12rpx; font-size: 28rpx; z-index: 99999; }`,
    `.vui-nav-bar { background: #fff; }`,
    `.vui-nav-bar__inner { display: flex; align-items: center; height: 88rpx; padding: 0 32rpx; }`,
    `.vui-nav-bar__back { font-size: 40rpx; padding-right: 16rpx; }`,
    `.vui-nav-bar__title { flex: 1; text-align: center; font-size: 32rpx; font-weight: 600; }`,
    `.vui-tab-bar { display: flex; background: #fff; border-top: 1rpx solid #eee; position: fixed; bottom: 0; left: 0; right: 0; }`,
    `.vui-tab-bar__item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 12rpx 0; font-size: 22rpx; }`,
    `.vui-tab-bar__item.active { color: #07c160; }`,
    `.vui-badge { position: relative; }`,
    `.vui-badge__text { position: absolute; top: -8rpx; right: -16rpx; min-width: 32rpx; height: 32rpx; padding: 0 8rpx; background: #fa5151; color: #fff; border-radius: 16rpx; font-size: 22rpx; display: flex; align-items: center; justify-content: center; }`,
    `.vui-skeleton { display: flex; gap: 24rpx; }`,
    `.vui-skeleton__avatar { width: 96rpx; height: 96rpx; border-radius: 8rpx; background: #f0f0f0; animation: skeleton 1.5s ease infinite; }`,
    `.vui-skeleton__content { flex: 1; }`,
    `.vui-skeleton__title { height: 32rpx; background: #f0f0f0; border-radius: 8rpx; margin-bottom: 16rpx; animation: skeleton 1.5s ease infinite; }`,
    `.vui-skeleton__row { height: 24rpx; background: #f0f0f0; border-radius: 8rpx; animation: skeleton 1.5s ease infinite; }`,
    `@keyframes skeleton { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`,
    `.vui-empty { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; }`,
    `.vui-empty__icon { font-size: 120rpx; }`,
    `.vui-empty__desc { font-size: 28rpx; color: #999; margin-top: 24rpx; }`,
    `.vui-loading { display: flex; flex-direction: column; align-items: center; }`,
    `.vui-loading__spinner { display: flex; flex-wrap: wrap; width: 60rpx; height: 60rpx; justify-content: space-around; }`,
    `.vui-loading__dot { width: 10rpx; height: 10rpx; background: #07c160; border-radius: 50%; animation: loading 1.2s ease infinite; }`,
    `@keyframes loading { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.5); opacity: 0.5; } }`,
    `.vui-switch { width: 100rpx; height: 56rpx; border-radius: 28rpx; background: #ccc; position: relative; transition: background 0.2s; }`,
    `.vui-switch.on { background: #07c160; }`,
    `.vui-switch__node { position: absolute; top: 4rpx; left: 4rpx; width: 48rpx; height: 48rpx; border-radius: 50%; background: #fff; transition: left 0.2s; }`,
    `.vui-switch.on .vui-switch__node { left: 48rpx; }`,
    `.vui-checkbox, .vui-radio { display: flex; align-items: center; gap: 12rpx; }`,
    `.vui-avatar { overflow: hidden; border-radius: 8rpx; background: #f0f0f0; display: flex; align-items: center; justify-content: center; }`,
    `.vui-avatar--small { width: 64rpx; height: 64rpx; }`,
    `.vui-avatar--medium { width: 96rpx; height: 96rpx; }`,
    `.vui-avatar--large { width: 128rpx; height: 128rpx; }`,
    `.vui-avatar__img { width: 100%; height: 100%; }`,
    `.vui-avatar__fallback { font-size: 40rpx; color: #999; }`,
    `.vui-swiper { width: 100%; height: 400rpx; }`,
    `.vui-swiper__img { width: 100%; height: 100%; }`,
    `.vui-rate { display: flex; gap: 8rpx; }`,
    `.vui-rate__star { font-size: 40rpx; color: #ddd; }`,
    `.vui-rate__star.active { color: #ffc107; }`,
    `.vui-tag { display: inline-flex; align-items: center; padding: 4rpx 16rpx; border-radius: 4rpx; font-size: 24rpx; background: #f0f0f0; }`,
    `.vui-tag--primary { background: #e8f5e9; color: #07c160; }`,
    `.vui-tag--warning { background: #fff3e0; color: #ff9800; }`,
    `.vui-tag--danger { background: #ffebee; color: #f44336; }`,
    `.vui-divider { display: flex; align-items: center; padding: 24rpx 32rpx; }`,
    `.vui-divider::before, .vui-divider::after { content: ''; flex: 1; height: 1rpx; background: #eee; }`,
    `.vui-divider__label { padding: 0 24rpx; font-size: 26rpx; color: #999; }`,
    `.vui-picker { display: flex; align-items: center; justify-content: space-between; padding: 24rpx 32rpx; background: #fff; border-bottom: 1rpx solid #eee; }`,
    `.vui-picker__value { font-size: 28rpx; color: #333; }`,
    `.vui-picker__arrow { color: #ccc; font-size: 28rpx; }`,
    `.vui-search-bar { display: flex; align-items: center; padding: 16rpx 24rpx; gap: 16rpx; }`,
    `.vui-search-bar__input-wrap { flex: 1; display: flex; align-items: center; gap: 12rpx; padding: 12rpx 16rpx; background: #f0f0f0; border-radius: 32rpx; }`,
    `.vui-search-bar__icon { font-size: 28rpx; }`,
    `.vui-search-bar__input { flex: 1; font-size: 28rpx; background: none; border: none; outline: none; }`,
    `.vui-search-bar__clear { color: #999; font-size: 28rpx; }`,
    `.vui-search-bar__cancel { font-size: 28rpx; color: #576a95; }`,
    `.vui-textarea-wrapper { position: relative; }`,
    `.vui-textarea { width: 100%; padding: 16rpx; border: 1rpx solid #ddd; border-radius: 8rpx; font-size: 28rpx; box-sizing: border-box; }`,
    `.vui-textarea__count { position: absolute; bottom: 8rpx; right: 16rpx; font-size: 24rpx; color: #999; }`,
  ].join('\n')
}

function generateJson(name: ComponentName): string {
  return JSON.stringify({ component: true, usingComponents: {}, styleIsolation: 'isolated' }, null, 2)
}

// ── 支付宝小程序代码 ──────────────────────────────────────────────────────────

function generateAlipay(name: ComponentName, entry: ComponentEntry, ts: boolean): string {
  const base = generateWeapp(name, entry, ts)
  return base
    .replace(/wx:/g, 'a:')
    .replace(/bindtap/g, 'onTap')
    .replace(/bindinput/g, 'onInput')
}

// ── 抖音小程序代码 ──────────────────────────────────────────────────────────

function generateDouyin(name: ComponentName, entry: ComponentEntry, ts: boolean): string {
  return generateWeapp(name, entry, ts)
}

// ── VibeUI 主类 ─────────────────────────────────────────────────────────────

class VibeUI {
  generate(
    names: ComponentName[],
    platform: ComponentPlatform,
    options: { outDir?: string; typescript?: boolean } = {}
  ): Map<ComponentName, ComponentSource> {
    const outDir = options.outDir || 'src/components'
    const ts = options.typescript !== false
    const sources = new Map<ComponentName, ComponentSource>()

    for (const name of names) {
      if (!_registryMap.has(name)) {
        console.warn('[VibeUI] Unknown component: ' + name)
        continue
      }
      sources.set(name, generateComponentSource(name, platform, outDir, ts))
    }

    return sources
  }

  getEntry(name: ComponentName): ComponentEntry | undefined {
    return _registryMap.get(name)
  }

  list(category?: Category): ComponentEntry[] {
    if (!category) return [..._registry]
    return _registry.filter(e => e.category === category)
  }

  getPreset(): ComponentName[] {
    return [..._presetComponents]
  }

  has(name: ComponentName): boolean {
    return _registryMap.has(name)
  }
}
