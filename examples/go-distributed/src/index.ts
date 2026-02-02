/**
 * UniAdapter Go分布式系统示例
 * 展示如何在Go微服务环境中使用UniAdapter
 */

import { 
  GoDistributedRPCAdapter, 
  GoDistributedMessageQueueAdapter,
  GoDistributedServiceDiscoveryAdapter,
  GoDistributedLockAdapter
} from '../../src/core/adapters/go-distributed';

class UserService {
  private rpc: GoDistributedRPCAdapter;
  private mq: GoDistributedMessageQueueAdapter;
  private discovery: GoDistributedServiceDiscoveryAdapter;
  private lock: GoDistributedLockAdapter;

  constructor() {
    this.rpc = new GoDistributedRPCAdapter();
    this.mq = new GoDistributedMessageQueueAdapter();
    this.discovery = new GoDistributedServiceDiscoveryAdapter();
    this.lock = new GoDistributedLockAdapter();
  }

  async getUser(userId: string) {
    console.log(`正在获取用户信息: ${userId}`);
    
    // 通过服务发现查找用户服务
    const services = await this.discovery.findService('UserService');
    if (services.length > 0) {
      const service = services[0];
      console.log(`找到用户服务: ${service.address}:${service.port}`);
      
      // 通过RPC调用用户服务
      const result = await this.rpc.call(
        'UserService', 
        'GetUser', 
        { userId }
      );
      
      return result;
    }
    
    throw new Error('UserService not available');
  }

  async createUser(userData: any) {
    console.log('创建用户中...');
    
    // 使用分布式锁确保用户创建的原子性
    return await this.lock.withLock(`user-create-${userData.email}`, 30000, async () => {
      // 通过RPC调用创建用户
      const result = await this.rpc.call(
        'UserService',
        'CreateUser',
        userData
      );
      
      // 发送用户创建事件到消息队列
      await this.mq.sendMessage('user-events', {
        eventType: 'USER_CREATED',
        userId: result.userId,
        timestamp: new Date().toISOString()
      });
      
      return result;
    });
  }

  async notifyUserEvent(event: any) {
    console.log('发送用户事件到消息队列');
    // 通过消息队列发送用户事件
    await this.mq.sendMessage('user-events', event);
  }

  async registerService() {
    console.log('注册服务到服务发现中心');
    // 注册当前服务到服务发现中心
    await this.discovery.registerService(
      'UserService',
      'localhost',
      8080,
      { version: '1.0.0', region: 'us-east-1' }
    );
  }
}

// 使用示例
async function main() {
  const userService = new UserService();
  
  try {
    // 注册服务
    await userService.registerService();
    
    // 创建用户
    const newUser = await userService.createUser({
      email: 'example@example.com',
      name: 'Example User'
    });
    console.log('创建用户结果:', newUser);
    
    // 获取用户
    const user = await userService.getUser(newUser.userId);
    console.log('获取用户结果:', user);
    
    // 发送事件
    await userService.notifyUserEvent({
      eventType: 'USER_LOGIN',
      userId: newUser.userId,
      timestamp: new Date().toISOString()
    });
    
    console.log('Go分布式示例执行完成');
  } catch (error) {
    console.error('执行过程中出现错误:', error);
  }
}

// 运行示例
if (require.main === module) {
  main().catch(console.error);
}

export default UserService;