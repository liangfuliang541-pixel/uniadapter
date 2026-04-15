/**
 * Component Tree View Provider
 */
import * as vscode from 'vscode'

interface CompItem { label: string; description: string; platforms: string; category: string }

const COMPONENTS: CompItem[] = [
  { label: 'Button', description: '按钮 · 多变体多尺寸', platforms: 'W/A/D/H', category: 'form' },
  { label: 'Input', description: '输入框', platforms: 'W/A/D/H', category: 'form' },
  { label: 'Textarea', description: '多行输入', platforms: 'W/A/D/H', category: 'form' },
  { label: 'Switch', description: '开关控件', platforms: 'W/A/D/H', category: 'form' },
  { label: 'Checkbox', description: '多选框', platforms: 'W/A/D/H', category: 'form' },
  { label: 'Radio', description: '单选框', platforms: 'W/A/D/H', category: 'form' },
  { label: 'Picker', description: '多列选择器', platforms: 'W/A/D/H', category: 'form' },
  { label: 'Rate', description: '星级评分', platforms: 'W/A/D/H', category: 'form' },
  { label: 'Card', description: '卡片容器', platforms: 'W/A/D/H', category: 'layout' },
  { label: 'Divider', description: '分割线', platforms: 'W/A/D/H', category: 'layout' },
  { label: 'Toast', description: '轻提示', platforms: 'W/A/D/H', category: 'feedback' },
  { label: 'Modal', description: '对话框', platforms: 'W/A/D/H', category: 'feedback' },
  { label: 'ActionSheet', description: '底部操作菜单', platforms: 'W/A/D/H', category: 'feedback' },
  { label: 'Skeleton', description: '骨架屏', platforms: 'W/A/D/H', category: 'feedback' },
  { label: 'Empty', description: '空状态', platforms: 'W/A/D/H', category: 'feedback' },
  { label: 'Loading', description: '加载指示器', platforms: 'W/A/D/H', category: 'feedback' },
  { label: 'NavBar', description: '导航栏', platforms: 'W/A/D/H', category: 'navigation' },
  { label: 'TabBar', description: '标签栏', platforms: 'W/A/D/H', category: 'navigation' },
  { label: 'SearchBar', description: '搜索框', platforms: 'W/A/D/H', category: 'navigation' },
  { label: 'List', description: '高性能列表', platforms: 'W/A/D/H', category: 'data' },
  { label: 'ListItem', description: '列表项', platforms: 'W/A/D/H', category: 'data' },
  { label: 'Avatar', description: '头像', platforms: 'W/A/D/H', category: 'data' },
  { label: 'Badge', description: '徽标', platforms: 'W/A/D/H', category: 'data' },
  { label: 'Tag', description: '标签', platforms: 'W/A/D/H', category: 'data' },
  { label: 'Swiper', description: '轮播图', platforms: 'W/A/D/H', category: 'media' },
]

const CATEGORIES: Record<string, { label: string; children: CompItem[] }> = {
  form: { label: 'Form 表单', children: [] },
  layout: { label: 'Layout 布局', children: [] },
  feedback: { label: 'Feedback 反馈', children: [] },
  navigation: { label: 'Navigation 导航', children: [] },
  data: { label: 'Data 数据', children: [] },
  media: { label: 'Media 媒体', children: [] },
}

for (const comp of COMPONENTS) {
  if (CATEGORIES[comp.category]) CATEGORIES[comp.category].children.push(comp)
}

export class ComponentTreeProvider implements vscode.TreeDataProvider<TreeNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeNode | undefined>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  getTreeItem(element: TreeNode): vscode.TreeItem {
    const item = new vscode.TreeItem(
      element.isCategory ? element.label : element.comp!.label,
      element.isCategory ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None
    )
    item.description = element.isCategory ? element.comp!.platforms : (element.comp?.platforms || '')
    item.tooltip = element.isCategory ? '' : (element.comp?.description || '')
    item.iconPath = element.isCategory
      ? new vscode.ThemeIcon('symbol-keyword')
      : new vscode.ThemeIcon('symbol-property')
    if (!element.isCategory && element.comp) {
      item.command = {
        command: 'uniadapter-vibe-devtools.insertComponent',
        title: 'Insert Component',
        arguments: [element.comp.label],
      }
    }
    return item
  }

  getChildren(element?: TreeNode): TreeNode[] {
    if (!element) return Object.values(CATEGORIES).map(c => ({ label: c.label, isCategory: true, comp: { platforms: String(c.children.length), description: '', label: '' } as any, children: undefined }))
    if (element.isCategory) {
      const key = Object.keys(CATEGORIES).find(k => CATEGORIES[k].label === element.label)
      if (!key) return []
      return CATEGORIES[key].children.map(c => ({ label: c.label, isCategory: false, comp: c, children: undefined }))
    }
    return []
  }
}

export interface TreeNode {
  label: string
  isCategory: boolean
  comp?: CompItem
  children?: TreeNode[]
}
