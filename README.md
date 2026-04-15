# 馃殌 UniAdapter - 鏅鸿兘澶氱閫傞厤鍣ㄦ鏋?

<p align="center">
  <img src="https://raw.githubusercontent.com/liangfuliang541-pixel/uniadapter/main/docs/images/logo.svg" width="200" alt="UniAdapter Logo"/>
</p>

<p align="center">
  <strong>涓€濂椾唬鐮侊紝閫傞厤鎵€鏈夊钩鍙?/strong><br>
  <sub>姣?Taro 鏇磋交閲?路 姣?uni-app 鏇寸伒娲?路 闆朵镜鍏?路 < 5KB</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/uniadapter?style=flat-square" alt="npm">
  <img src="https://img.shields.io/npm/dm/uniadapter?style=flat-square" alt="Downloads">
  <img src="https://img.shields.io/github/stars/liangfuliang541-pixel/uniadapter?style=flat-square" alt="Stars">
  <img src="https://img.shields.io/github/license/liangfuliang541-pixel/uniadapter?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/TypeScript--blue?style=flat-square" alt="TypeScript">
</p>

---

## 猸?涓轰粈涔堥€夋嫨 UniAdapter锛?

| 鐗规€?| UniAdapter | Taro | uni-app | Rax |
|------|:----------:|:----:|:--------:|:---:|
| **鍖呬綋绉?* | **< 5KB** | ~500KB | ~800KB | ~300KB |
| **渚靛叆鎬?* | **闆朵镜鍏?* | 楂?| 楂?| 涓?|
| **Go 寰湇鍔?* | **鉁?鏀寔** | 鉂?| 鉂?| 鉂?|
| **瀛︿範鎴愭湰** | **鏋佷綆** | 涓?| 涓?| 楂?|
| **React Hooks** | **鉁?鍘熺敓** | 闇€閫傞厤 | 闇€閫傞厤 | 閮ㄥ垎 |
| **鎸夐渶鍔犺浇** | **鉁?鑷姩** | 閮ㄥ垎 | 閮ㄥ垎 | 閮ㄥ垎 |
| **TypeScript** | **鉁?瀹屾暣** | 鉁?| 鉁?| 鉁?|

> **UniAdapter 鏄洰鍓嶅敮涓€鏀寔 Go 鍒嗗竷寮忕郴缁熺殑澶氱閫傞厤妗嗘灦**锛岃浣犱粠鍓嶇鍒板悗绔井鏈嶅姟浣跨敤鍚屼竴濂楅€傞厤鐞嗗康銆?

---

## 馃摫 鏀寔骞冲彴

| 骞冲彴 | 鏍囪瘑 | 鐘舵€?|
|------|------|------|
| 馃寪 Web / H5 | `h5` | 鉁?绋冲畾 |
| 馃惁 寰俊灏忕▼搴?| `weapp` | 鉁?绋冲畾 |
| 馃挵 鏀粯瀹濆皬绋嬪簭 | `alipay` | 鉁?绋冲畾 |
| 馃幍 鎶栭煶灏忕▼搴?| `douyin` | 鉁?绋冲畾 |
| 馃摑 灏忕孩涔﹀皬绋嬪簭 | `xiaohongshu` | 鉁?绋冲畾 |
| 馃椇锔?楂樺痉鍦板浘 | `amap` | 鉁?绋冲畾 |
| 馃摫 React Native | `react-native` | 鉁?绋冲畾 |
| 馃悽 Go 鍒嗗竷寮忕郴缁?| `go-distributed` | 鉁?绋冲畾 |
| 馃攳 娴忚鍣ㄦ墿灞?| `extension` | 馃敎 寮€鍙戜腑 |
| 馃煝 楦胯挋 OS | `harmonyos` | 馃敎 寮€鍙戜腑 |

---

## 馃幆 鏍稿績鐞嗗康

```
Write Once, Run Everywhere with Intelligence
```

UniAdapter 閫氳繃**閫傞厤鍣ㄦā寮?*瑙ｅ喅璺ㄥ钩鍙板吋瀹归棶棰橈細
- 鑷姩妫€娴嬭繍琛岀幆澧?
- 闆朵镜鍏ユ帴鍏ョ幇鏈夐」鐩?
- 缂栬瘧鏃朵紭鍖栵紝杩愯鏃堕浂寮€閿€
- 瀹屾暣 TypeScript 绫诲瀷鏀寔

---

## 馃殌 蹇€熷紑濮?

### 瀹夎

```bash
npm install @liangfu/uniadapter
# 鎴?
yarn add uniadapter
# 鎴?
pnpm add uniadapter
```

### 鍩虹绀轰緥

```tsx
import { usePlatform, useUniState, useUniRequest, useUniRouter } from 'uniadapter'

function App() {
  // 馃殌 鑷姩妫€娴嬪綋鍓嶅钩鍙?
  const platform = usePlatform()
  
  // 馃摝 缁熶竴鐨勭姸鎬佺鐞嗭紙鎵€鏈夊钩鍙拌涓轰竴鑷达級
  const [count, setCount] = useUniState(0)
  
  // 馃寪 缁熶竴鐨勭綉缁滆姹?
  const { get, post } = useUniRequest()
  
  // 馃Л 缁熶竴鐨勮矾鐢辨搷浣?
  const { push, replace, goBack } = useUniRouter()

  const handleClick = async () => {
    setCount(count + 1)
    // 馃惁 鑷姩閫傞厤寰俊/鏀粯瀹?鎶栭煶灏忕▼搴忕殑 navigateTo
    // 馃寪 鑷姩閫傞厤 Web 鐨?history.pushState
    push('/detail/123')
  }

  return (
    <div>
      <p>褰撳墠骞冲彴: {platform.name}</p>
      <p>璁℃暟: {count}</p>
      <button onClick={handleClick}>鐐规垜</button>
    </div>
  )
}
```

### 骞冲彴鐗瑰畾 API

```tsx
import { storage, location, camera, biometric } from 'uniadapter/adapters'

// 馃捑 缁熶竴瀛樺偍锛堣嚜鍔ㄩ€傞厤鍚勫钩鍙?Storage API锛?
await storage.set('token', 'xxx')
const token = await storage.get('token')

// 馃搷 缁熶竴瀹氫綅锛堝井淇?鏀粯瀹?楂樺痉/娴忚鍣ㄧ粺涓€鎺ュ彛锛?
const position = await location.getCurrentPosition()

// 馃摲 缁熶竴鐩告満锛堣嚜鍔ㄩ€夋嫨骞冲彴鍘熺敓 API锛?
const photos = await camera.takePhoto()

// 馃攼 缁熶竴鐢熺墿璇嗗埆锛堟寚绾?闈㈠锛?
const result = await biometric.authenticate('楠岃瘉韬唤')
```

---

## 馃彈锔?鏋舵瀯璁捐

```
鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?
鈹?             搴旂敤浠ｇ爜 (React)                 鈹?
鈹溾攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?
鈹?             缁熶竴 API 灞?                     鈹?
鈹? useUniState | useUniRouter | useUniRequest 鈹?
鈹溾攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?
鈹?           閫傞厤鍣ㄥ伐鍘?(AdapterFactory)       鈹?
鈹溾攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?
鈹?Web    鈹?寰俊    鈹?鏀粯瀹? 鈹?Go 寰湇鍔?       鈹?
鈹?H5     鈹?灏忕▼搴?  鈹?鎶栭煶    鈹?楂樺痉鍦板浘         鈹?
鈹?       鈹?灏忕孩涔?  鈹?RN     鈹?娴忚鍣ㄦ墿灞?      鈹?
鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹粹攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹粹攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹粹攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?
```

### 鏍稿績鐗规€?

- **鎸夐渶鍔犺浇**: 鏍稿績搴?< 5KB锛屽钩鍙伴€傞厤鍣ㄦ寜闇€鍔犺浇
- **闆朵镜鍏?*: 鐜版湁 React 椤圭洰鍙笎杩涘紡鎺ュ叆
- **绫诲瀷瀹夊叏**: 瀹屾暣 TypeScript 鏀寔锛屾櫤鑳芥彁绀?
- **鎻掍欢绯荤粺**: 鏀寔鑷畾涔夋墿灞曞拰骞冲彴閫傞厤

---

## 馃И 骞冲彴妫€娴?

```typescript
import { platformDetection } from 'uniadapter'

const platform = platformDetection

console.log({
  type: platform.type,           // 'web' | 'mini-program' | 'app' | 'server'
  isWeb: platform.isWeb,         // true
  isMobile: platform.isMobile,   // true/false
  name: platform.name,           // 'weapp' | 'alipay' | 'h5' | ...
  version: platform.version      // '1.0.0'
})

// 鍒ゆ柇褰撳墠骞冲彴
if (platform.isWeapp) {
  // 寰俊灏忕▼搴忕壒鏈夐€昏緫
}

if (platform.isMobile) {
  // 绉诲姩绔紭鍖?
}
```

---

## 馃摝 Go 鍒嗗竷寮忕郴缁熸敮鎸?(鐙鍔熻兘)

UniAdapter 鏄?*涓氱晫棣栦釜**鏀寔 Go 寰湇鍔＄殑澶氱閫傞厤妗嗘灦锛?

```typescript
import { goAdapter } from 'uniadapter/adapters/go-distributed'

// 馃殌 寰湇鍔¤皟鐢?
const userService = goAdapter.service('user')
const user = await userService.call('GetUser', { id: 1 })

// 馃攼 鍒嗗竷寮忛攣
const lock = goAdapter.distributedLock('order-lock')
await lock.acquire()
try {
  // 涓氬姟閫昏緫
} finally {
  await lock.release()
}

// 馃摤 娑堟伅闃熷垪
const queue = goAdapter.queue('notifications')
await queue.publish({ type: 'email', to: 'user@example.com' })
```

---

## 馃搳 椤圭洰缁熻

| 鎸囨爣 | 鏁版嵁 |
|------|------|
| 鏍稿績搴撲綋绉?| **< 5KB** (Gzipped) |
| 鍚姩鏃堕棿 | **< 50ms** |
| 鏀寔骞冲彴鏁?| **9+** |
| TypeScript 瑕嗙洊鐜?| **100%** |
| 娴嬭瘯瑕嗙洊鐜?| **> 80%** |

---

## 馃洜锔?寮€鍙戝伐鍏?

### CLI 宸ュ叿

```bash
npx uniadapter init    # 鍒濆鍖栭」鐩?
npx uniadapter add     # 娣诲姞鏂板钩鍙?
npx uniadapter verify  # 楠岃瘉鍏煎鎬?
```

### 璋冭瘯妯″紡

```typescript
import { initDebug } from 'uniadapter'

initDebug({
  level: 'verbose',  // 'error' | 'warn' | 'info' | 'verbose'
  showPlatform: true // 鏄剧ず褰撳墠骞冲彴淇℃伅
})
```

---

## 馃専 鐗堟湰璺嚎鍥?

| 鐗堟湰 | 鍐呭 | 鐘舵€?|
|------|------|------|
| v1.0 | 鍩虹澶氱閫傞厤妗嗘灦 | 鉁?宸插畬鎴?|
| v1.1 | 鏂板鎶栭煶銆侀珮寰枫€佸皬绾功鏀寔 | 鉁?宸插畬鎴?|
| v1.2 | Go 鍒嗗竷寮忕郴缁熸敮鎸?| 鉁?宸插畬鎴?|
| v1.3 | 鏀粯瀹濆皬绋嬪簭 + 楦胯挋 OS | 鉁?宸插畬鎴?|
| v2.0 | AI 鑳藉姏闆嗘垚涓庣敓鎬佹墿灞?| 馃敎 寮€鍙戜腑 |

---

## 馃 璐＄尞

娆㈣繋鎻愪氦 Issue 鍜?Pull Request锛?

```bash
# 鍏嬮殕椤圭洰
git clone https://github.com/liangfuliang541-pixel/uniadapter.git

# 瀹夎渚濊禆
npm install

# 寮€鍙戞ā寮?
npm run dev

# 杩愯娴嬭瘯
npm test

# 杩愯娴嬭瘯锛圲I锛?
npm run test:ui

# 浠ｇ爜妫€鏌?
npm run lint

# 鏍煎紡鍖栦唬鐮?
npm run format
```

璇︾粏璐＄尞鎸囧崡璇锋煡鐪?[CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 馃搫 寮€婧愬崗璁?

鏈」鐩噰鐢?[MIT](./LICENSE) 寮€婧愬崗璁€?

---

## 馃摓 鑱旂郴鏂瑰紡

- 馃摟 閭: 3578544805@qq.com
- 馃悪 GitHub: [liangfuliang541-pixel](https://github.com/liangfuliang541-pixel)
- 馃悰 闂鍙嶉: [Issues](https://github.com/liangfuliang541-pixel/uniadapter/issues)

---

<p align="center">
  <strong>猸?濡傛灉杩欎釜椤圭洰瀵逛綘鏈夊府鍔╋紝璇风粰涓€涓?Star锛?/strong>
</p>
