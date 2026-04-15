/**
 * VibeDevTools Webview View Provider
 */
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

export class VibeDevToolsProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'uniadapter-vibe-devtools.view'
  private webview?: vscode.Webview
  private context: vscode.ExtensionContext

  constructor(context: vscode.ExtensionContext) { this.context = context }

  resolveWebviewView(webviewView: vscode.WebviewView, _c: vscode.WebviewViewResolveContext, _t: vscode.CancellationToken) {
    this.webview = webviewView.webview
    webviewView.webview.options = { enableScripts: true, localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'src')] }
    webviewView.webview.html = this.getHtmlContent()
    webviewView.webview.onDidReceiveMessage(async (msg: any) => { await this.handleMessage(msg, webviewView) })
  }

  private async handleMessage(msg: any, view: vscode.WebviewView) {
    const { type, payload } = msg
    if (type === 'generate') {
      const resp = generateResponse(payload.prompt, payload.platform)
      const chunks = splitIntoChunks(resp, 60)
      view.webview.postMessage({ type: 'streamStart', payload: { prompt: payload.prompt } })
      for (const c of chunks) {
        view.webview.postMessage({ type: 'streamChunk', payload: { chunk: c } })
        await new Promise(r => setTimeout(r, 60))
      }
      view.webview.postMessage({ type: 'streamEnd', payload: { files: parseFiles(resp) } })
      vscode.window.showInformationMessage('VibeEngine: Generated ' + chunks.length + ' file(s)')
    } else if (type === 'copyCode') {
      await vscode.env.clipboard.writeText(payload.code)
      vscode.window.showInformationMessage('Copied to clipboard')
    } else if (type === 'insertFile') {
      const folder = vscode.workspace.workspaceFolders?.[0]
      if (!folder) { vscode.window.showWarningMessage('Open a workspace first'); return }
      const fp = path.join(folder.uri.fsPath, payload.filename)
      const dir = path.dirname(fp)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(fp, payload.code, 'utf-8')
      const doc = await vscode.workspace.openTextDocument(fp)
      await vscode.window.showTextDocument(doc, { preview: false })
      vscode.window.showInformationMessage('Created: ' + payload.filename)
    } else if (type === 'selectComponent') {
      view.webview.postMessage({ type: 'componentCode', payload: { name: payload.name, code: generateComponent(payload.name) } })
    }
  }

  private getHtmlContent(): string {
    return fs.readFileSync(path.join(this.context.extensionUri.fsPath, 'src', 'webview.html'), 'utf-8')
  }
}

// ── Response generation ─────────────────────────────────────────────────────────

export function generateResponse(prompt: string, platform = 'weapp'): string {
  const p = platform || 'weapp'
  const ext = p === 'weapp' ? 'wxml' : p === 'alipay' ? 'axml' : p === 'douyin' ? 'ttml' : 'html'
  const sExt = p === 'weapp' ? 'wxss' : p === 'alipay' ? 'acss' : p === 'douyin' ? 'ttss' : 'css'
  const api = p === 'weapp' ? 'wx' : p === 'alipay' ? 'my' : p === 'douyin' ? 'tt' : 'uni'
  const isProduct = /商品|详情/.test(prompt)
  const isLogin = /登录|注册|验证码/.test(prompt)
  const isSearch = /搜索|列表/.test(prompt)
  const isProfile = /个人中心|用户/.test(prompt)

  if (isProduct) {
    const ts = "import { useUniState, useUniRouter } from '@liangfu/uniadapter'\n\nconst { data, setData } = useUniState({\n  goods: { id: '10001', name: 'Product Name', price: 89, origPrice: 199, images: ['img1.jpg', 'img2.jpg'] },\n  selectedSku: {},\n  quantity: 1,\n})\nconst { navigateTo } = useUniRouter()\n\nfunction selectSku(id: string, opt: string) { setData('selectedSku', { ...data.selectedSku, [id]: opt }) }\n\nasync function addToCart() {\n  " + api + ".showLoading({ title: 'Adding...' })\n  " + api + ".hideLoading()\n  " + api + ".showToast({ title: 'Added to cart', icon: 'success' })\n}\n\nfunction buyNow() { " + api + ".navigateTo({ url: '/pages/order/confirm' }) }\n\nPage()"
    const tpl = "<view class=\"goods-detail\">\n  <swiper class=\"goods-swiper\" indicator-dots autoplay circular>\n    <block wx:for=\"{{goods.images}}\" wx:key=\"index\">\n      <swiper-item><image class=\"goods-image\" src=\"{{item}}\" mode=\"aspectFill\" /></swiper-item>\n    </block>\n  </swiper>\n  <view class=\"price-section\">\n    <text class=\"price\">¥{{goods.price}}</text>\n    <text class=\"orig-price\">¥{{goods.origPrice}}</text>\n  </view>\n  <view class=\"goods-name\">{{goods.name}}</view>\n  <view class=\"action-bar\">\n    <view class=\"btn-add\" bindtap=\"addToCart\">Add to Cart</view>\n    <view class=\"btn-buy\" bindtap=\"buyNow\">Buy Now</view>\n  </view>\n</view>"
    const style = ".goods-detail { padding-bottom: 120rpx; }\n.goods-swiper { height: 750rpx; }\n.goods-image { width: 100%; height: 100%; }\n.price-section { padding: 24rpx; display: flex; align-items: baseline; gap: 16rpx; }\n.price { font-size: 48rpx; color: #ff4757; font-weight: 700; }\n.orig-price { font-size: 28rpx; color: #999; text-decoration: line-through; }\n.goods-name { padding: 0 24rpx 24rpx; font-size: 32rpx; font-weight: 600; }\n.action-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 100rpx; display: flex; align-items: center; background: #fff; border-top: 1rpx solid #eee; }\n.btn-add { flex: 1; background: #ff9500; color: #fff; text-align: center; line-height: 100rpx; }\n.btn-buy { flex: 1; background: #ff4757; color: #fff; text-align: center; line-height: 100rpx; }"
    const json = '{ "navigationBarTitleText": "Product Detail", "usingComponents": {} }'
    return "---\\FILE:pages/demo/index.ts---\\n" + ts + "\\n\\n---\\FILE:pages/demo/index." + ext + "---\\n" + tpl + "\\n\\n---\\FILE:pages/demo/index." + sExt + "---\\n" + style + "\\n\\n---\\FILE:pages/demo/index.json---\\n" + json
  } else if (isLogin) {
    const ts = "import { useUniState } from '@liangfu/uniadapter'\n\nconst { data, setData } = useUniState({ phone: '', code: '', countdown: 0 })\nconst { switchTab } = useUniRouter()\n\nasync function sendCode() {\n  " + api + ".showToast({ title: 'Code sent', icon: 'success' })\n  setData('countdown', 60)\n}\n\nasync function login() {\n  " + api + ".showToast({ title: 'Login success', icon: 'success' })\n}\n\nPage()"
    const tpl = "<view class=\"login-page\">\n  <view class=\"logo-area\"><view class=\"logo\">Vibe</view><view class=\"app-name\">App Name</view></view>\n  <view class=\"form\">\n    <view class=\"input-row\"><text class=\"label\">+86</text><input class=\"input\" type=\"number\" maxlength=\"11\" placeholder=\"Phone number\" /></view>\n    <view class=\"input-row\"><input class=\"input\" type=\"number\" maxlength=\"6\" placeholder=\"Code\" /><view class=\"code-btn\" bindtap=\"sendCode\">{{countdown > 0 ? countdown + 's' : 'Get Code'}}</view></view>\n    <button class=\"login-btn\" bindtap=\"login\">Login</button>\n  </view>\n</view>"
    const style = ".login-page { min-height: 100vh; background: #fff; padding: 80rpx 48rpx; }\n.logo-area { text-align: center; margin-bottom: 80rpx; }\n.logo { width: 120rpx; height: 120rpx; border-radius: 24rpx; background: linear-gradient(135deg, #667eea, #764ba2); margin: 0 auto 24rpx; }\n.app-name { font-size: 40rpx; font-weight: 700; }\n.form { }\n.input-row { display: flex; align-items: center; border-bottom: 1rpx solid #eee; padding: 24rpx 0; }\n.label { font-size: 30rpx; margin-right: 16rpx; }\n.input { flex: 1; font-size: 30rpx; }\n.code-btn { font-size: 28rpx; color: #667eea; white-space: nowrap; }\n.login-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; border-radius: 48rpx; height: 96rpx; line-height: 96rpx; margin-top: 32rpx; font-size: 32rpx; }"
    const json = '{ "navigationBarTitleText": "Login", "navigationStyle": "custom" }'
    return "---\\FILE:pages/demo/index.ts---\\n" + ts + "\\n\\n---\\FILE:pages/demo/index." + ext + "---\\n" + tpl + "\\n\\n---\\FILE:pages/demo/index." + sExt + "---\\n" + style + "\\n\\n---\\FILE:pages/demo/index.json---\\n" + json
  } else if (isSearch) {
    const ts = "import { useUniState, useUniRouter } from '@liangfu/uniadapter'\n\nconst { data } = useUniState({\n  goodsList: [\n    { id: '1', name: 'Product 1', price: 89, sales: 3260, image: 'img1.jpg' },\n    { id: '2', name: 'Product 2', price: 129, sales: 1840, image: 'img2.jpg' },\n    { id: '3', name: 'Product 3', price: 199, sales: 980, image: 'img3.jpg' },\n  ],\n})\n\nfunction goDetail(id: string) { " + api + ".navigateTo({ url: '/pages/goods/detail?id=' + id }) }\n\nPage()"
    const tpl = "<view class=\"search-page\">\n  <view class=\"search-bar\"><input class=\"search-input\" placeholder=\"Search products\" /></view>\n  <view class=\"goods-list\">\n    <block wx:for=\"{{goodsList}}\" wx:key=\"id\">\n      <view class=\"goods-card\" bindtap=\"goDetail\" data-id=\"{{item.id}}\">\n        <image class=\"goods-img\" src=\"{{item.image}}\" mode=\"aspectFill\" />\n        <view class=\"goods-info\">\n          <text class=\"goods-name\">{{item.name}}</text>\n          <view class=\"goods-bottom\"><text class=\"goods-price\">¥{{item.price}}</text><text class=\"goods-sales\">Sales {{item.sales}}</text></view>\n        </view>\n      </view>\n    </block>\n  </view>\n</view>"
    const style = ".search-page { min-height: 100vh; background: #f5f5f5; }\n.search-bar { background: #fff; padding: 16rpx 24rpx; }\n.search-input { height: 72rpx; background: #f5f5f5; border-radius: 36rpx; padding: 0 32rpx; font-size: 28rpx; }\n.goods-list { display: flex; flex-wrap: wrap; gap: 2rpx; background: #f5f5f5; padding: 2rpx; }\n.goods-card { width: calc(50% - 1rpx); background: #fff; margin-bottom: 2rpx; }\n.goods-img { width: 100%; height: 360rpx; }\n.goods-info { padding: 16rpx; }\n.goods-name { font-size: 28rpx; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }\n.goods-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 12rpx; }\n.goods-price { font-size: 32rpx; color: #ff4757; font-weight: 700; }\n.goods-sales { font-size: 22rpx; color: #999; }"
    const json = '{ "navigationBarTitleText": "Search", "enablePullDownRefresh": true }'
    return "---\\FILE:pages/demo/index.ts---\\n" + ts + "\\n\\n---\\FILE:pages/demo/index." + ext + "---\\n" + tpl + "\\n\\n---\\FILE:pages/demo/index." + sExt + "---\\n" + style + "\\n\\n---\\FILE:pages/demo/index.json---\\n" + json
  } else if (isProfile) {
    const ts = "import { useUniState, useUniRouter } from '@liangfu/uniadapter'\n\nconst { data } = useUniState({ user: { name: 'User', avatar: '', level: 'VIP' } })\nconst { navigateTo } = useUniRouter()\n\nfunction goOrder(status: string) { navigateTo('/pages/order/list?status=' + status) }\n\nPage()"
    const tpl = "<view class=\"profile-page\">\n  <view class=\"user-card\">\n    <image class=\"avatar\" src=\"{{user.avatar || '/assets/default.png'}}\" />\n    <view class=\"user-info\"><text class=\"name\">{{user.name}}</text><text class=\"level\">{{user.level}}</text></view>\n  </view>\n  <view class=\"order-section\">\n    <view class=\"order-header\"><text>My Orders</text><text class=\"more\">All</text></view>\n    <view class=\"order-tabs\">\n      <view class=\"order-tab\" bindtap=\"goOrder('pending')\"><text>0</text><text>Pending</text></view>\n      <view class=\"order-tab\" bindtap=\"goOrder('paid')\"><text>0</text><text>Paid</text></view>\n      <view class=\"order-tab\" bindtap=\"goOrder('shipped')\"><text>0</text><text>Shipped</text></view>\n      <view class=\"order-tab\" bindtap=\"goOrder('done')\"><text>0</text><text>Done</text></view>\n    </view>\n  </view>\n  <view class=\"menu-list\">\n    <view class=\"menu-item\" bindtap=\"navigateTo('/pages/address/list')\"><text>Addresses</text><text>></text></view>\n    <view class=\"menu-item\" bindtap=\"navigateTo('/pages/settings')\"><text>Settings</text><text>></text></view>\n  </view>\n</view>"
    const style = ".profile-page { min-height: 100vh; background: #f5f5f5; }\n.user-card { background: linear-gradient(135deg, #667eea, #764ba2); padding: 48rpx 32rpx; display: flex; align-items: center; gap: 24rpx; }\n.avatar { width: 120rpx; height: 120rpx; border-radius: 50%; border: 4rpx solid rgba(255,255,255,0.3); }\n.user-info { flex: 1; }\n.name { font-size: 36rpx; font-weight: 700; color: #fff; display: block; }\n.level { font-size: 24rpx; color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.2); padding: 4rpx 16rpx; border-radius: 20rpx; margin-top: 8rpx; display: inline-block; }\n.order-section { background: #fff; margin: 24rpx; border-radius: 16rpx; padding: 24rpx; }\n.order-header { display: flex; justify-content: space-between; margin-bottom: 24rpx; }\n.order-tabs { display: flex; justify-content: space-around; }\n.order-tab { display: flex; flex-direction: column; align-items: center; gap: 8rpx; }\n.menu-list { background: #fff; margin: 0 24rpx; border-radius: 16rpx; overflow: hidden; }\n.menu-item { display: flex; justify-content: space-between; padding: 32rpx 24rpx; border-bottom: 1rpx solid #f0f0f0; font-size: 28rpx; }\n.menu-item:last-child { border-bottom: none; }"
    const json = '{ "navigationBarTitleText": "Profile", "usingComponents": {} }'
    return "---\\FILE:pages/demo/index.ts---\\n" + ts + "\\n\\n---\\FILE:pages/demo/index." + ext + "---\\n" + tpl + "\\n\\n---\\FILE:pages/demo/index." + sExt + "---\\n" + style + "\\n\\n---\\FILE:pages/demo/index.json---\\n" + json
  } else {
    const ts = "import { useUniState, useUniRouter } from '@liangfu/uniadapter'\n\nconst { data, setData } = useUniState({})\nconst { navigateTo } = useUniRouter()\n\nPage()"
    const tpl = "<view class=\"page\"><text class=\"title\">VibeEngine Generated Page</text></view>"
    const style = ".page { min-height: 100vh; padding: 48rpx; }\n.title { font-size: 36rpx; font-weight: 600; }"
    const json = '{ "usingComponents": {} }'
    return "---\\FILE:pages/demo/index.ts---\\n" + ts + "\\n\\n---\\FILE:pages/demo/index." + ext + "---\\n" + tpl + "\\n\\n---\\FILE:pages/demo/index." + sExt + "---\\n" + style + "\\n\\n---\\FILE:pages/demo/index.json---\\n" + json
  }
}

export function generateComponent(name: string): string {
  return "// " + name + " component\n// Generated by UniAdapter VibeDevTools\n\nComponent({\n  properties: {\n    variant: { type: String, value: 'primary' },\n    size: { type: String, value: 'medium' },\n    disabled: { type: Boolean, value: false },\n    loading: { type: Boolean, value: false },\n  },\n\n  data: {},\n\n  methods: {\n    onTap() {\n      if (this.data.disabled || this.data.loading) return\n      this.triggerEvent('click')\n    },\n  },\n})"
}

export function splitIntoChunks(text: string, size: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size))
  return chunks
}

export interface GeneratedFile { filename: string; content: string; lang: string }

export function parseFiles(content: string): GeneratedFile[] {
  const files: GeneratedFile[] = []
  const lines = content.split('\n')
  let cur: { filename: string; lines: string[] } | null = null
  for (const line of lines) {
    const m = line.match(/^---\\FILE:([^---]+)---/)
    if (m) {
      if (cur) {
        const fn = cur.filename.trim()
        const lang = /\.(wxml|axml|ttml|html)$/.test(fn) ? 'wxml'
          : /\.(wxss|acss|ttss|css)$/.test(fn) ? 'css'
          : /\.json$/.test(fn) ? 'json' : 'typescript'
        files.push({ filename: fn, content: cur.lines.join('\n'), lang })
      }
      cur = { filename: m[1], lines: [] }
    } else if (cur) cur.lines.push(line)
  }
  if (cur) {
    const fn = cur.filename.trim()
    const lang = /\.(wxml|axml|ttml|html)$/.test(fn) ? 'wxml'
      : /\.(wxss|acss|ttss|css)$/.test(fn) ? 'css'
      : /\.json$/.test(fn) ? 'json' : 'typescript'
    files.push({ filename: fn, content: cur.lines.join('\n'), lang })
  }
  return files
}
