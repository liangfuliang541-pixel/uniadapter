# UniAdapter 示例项目

这是一个展示UniAdapter多端适配能力的示例项目。

## 项目结构

```
examples/
├── basic-usage/           # 基础使用示例
├── advanced-features/     # 高级特性示例
├── platform-specific/     # 平台特定功能示例
└── go-distributed/       # Go分布式系统示例
```

## 基础使用示例

```typescript
// examples/basic-usage/src/App.tsx
import React from 'react';
import { useUniState, useUniRouter, useUniRequest } from 'uniadapter';

const App = () => {
  const [count, setCount] = useUniState(0);
  const { push } = useUniRouter();
  const { get } = useUniRequest();

  const increment = () => {
    setCount(count + 1);
  };

  const fetchData = async () => {
    const data = await get('/api/data');
    console.log(data);
  };

  return (
    <div>
      <h1>UniAdapter 示例</h1>
      <p>计数: {count}</p>
      <button onClick={increment}>增加</button>
      <button onClick={() => push('/about')}>跳转到关于页</button>
      <button onClick={fetchData}>获取数据</button>
    </div>
  );
};

export default App;
```

## 高级特性示例

```typescript
// examples/advanced-features/src/StorageExample.tsx
import React, { useEffect, useState } from 'react';
import { storage } from 'uniadapter/adapters';

const StorageExample = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const loadValue = async () => {
      const storedValue = await storage.get('myKey');
      if (storedValue) {
        setValue(storedValue);
      }
    };
    loadValue();
  }, []);

  const saveValue = async () => {
    await storage.set('myKey', value);
  };

  return (
    <div>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
      <button onClick={saveValue}>保存</button>
    </div>
  );
};

export default StorageExample;
```

## Go分布式系统示例

```typescript
// examples/go-distributed/src/MicroserviceExample.ts
import { 
  GoDistributedRPCAdapter, 
  GoDistributedMessageQueueAdapter,
  GoDistributedServiceDiscoveryAdapter
} from 'uniadapter/adapters';

class UserService {
  private rpc: GoDistributedRPCAdapter;
  private mq: GoDistributedMessageQueueAdapter;
  private discovery: GoDistributedServiceDiscoveryAdapter;

  constructor() {
    this.rpc = new GoDistributedRPCAdapter();
    this.mq = new GoDistributedMessageQueueAdapter();
    this.discovery = new GoDistributedServiceDiscoveryAdapter();
  }

  async getUser(userId: string) {
    // 通过RPC调用用户服务
    const services = await this.discovery.findService('UserService');
    if (services.length > 0) {
      const service = services[0];
      return await this.rpc.call(
        'UserService', 
        'GetUser', 
        { userId, serviceAddress: service.address, servicePort: service.port }
      );
    }
    throw new Error('UserService not available');
  }

  async notifyUserEvent(event: any) {
    // 通过消息队列发送用户事件
    await this.mq.sendMessage('user-events', event);
  }
}

export default UserService;
```

## 运行示例

```bash
# 进入示例目录
cd examples/basic-usage

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 平台适配说明

不同平台的适配效果：

- **Web/H5**: 使用浏览器API
- **微信小程序**: 使用微信小程序API
- **抖音小程序**: 使用抖音小程序API
- **高德地图**: 使用高德地图API
- **Go分布式**: 使用微服务API

## 贡献

欢迎提交PR来丰富示例项目！