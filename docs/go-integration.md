# Go Distributed Systems Integration

UniAdapter provides seamless integration with Go distributed systems through RPC, message queues, and service discovery.

## Architecture

The Go adapter layer translates frontend API calls to backend Go services:

```
Frontend (useUniRequest, useUniState)
         ↓
UniAdapter Hooks
         ↓
Go Distributed Adapter (go-distributed.ts)
         ↓
Go Services (RPC, gRPC, HTTP)
```

## RPC Calls

### Basic RPC Request

```typescript
import { useUniRequest } from 'uniadapter'

function UserService() {
  const request = useUniRequest()
  
  // Call Go RPC endpoint
  const getUser = async (userId: string) => {
    return request.post('/rpc/UserService/GetProfile', {
      userId
    })
  }
  
  return <UserProfile getUser={getUser} />
}
```

### RPC with Error Handling

```typescript
async function fetchUserData(userId: string) {
  try {
    const response = await request.post('/rpc/UserService/GetData', {
      userId
    })
    return response.data
  } catch (error) {
    console.error('RPC call failed:', error)
    // Fallback: load from local cache
    return getLocalCache(userId)
  }
}
```

## Message Queues

### Publishing Events

```typescript
import { useUniRequest } from 'uniadapter'

async function publishUserEvent(eventType: string, payload: any) {
  const request = useUniRequest()
  
  await request.post('/mq/publish', {
    topic: `user.${eventType}`,
    data: payload,
    timestamp: Date.now()
  })
}

// Usage
await publishUserEvent('created', { userId: '123', name: 'John' })
await publishUserEvent('updated', { userId: '123', email: 'john@example.com' })
```

### Message Processing

```typescript
// Frontend can subscribe to backend-published events
function EventListener() {
  const request = useUniRequest()
  
  React.useEffect(() => {
    const pollEvents = async () => {
      const events = await request.get('/mq/consume', {
        topic: 'user.updated'
      })
      handleEvents(events)
    }
    
    const interval = setInterval(pollEvents, 5000)
    return () => clearInterval(interval)
  }, [])
}
```

## Service Discovery

### Finding Services

```typescript
import { useUniRequest } from 'uniadapter'

async function discoverService(serviceName: string) {
  const request = useUniRequest()
  
  const instances = await request.get('/discovery/find', {
    service: serviceName
  })
  
  // Load balance across instances
  const instance = instances[Math.floor(Math.random() * instances.length)]
  
  return instance.address
}

// Usage
const userServiceAddr = await discoverService('UserService')
```

### Health Checks

```typescript
async function checkServiceHealth(serviceName: string) {
  const request = useUniRequest()
  
  try {
    const health = await request.get('/health', {
      service: serviceName
    })
    return health.status === 'healthy'
  } catch {
    return false
  }
}
```

## Distributed Locks

### Acquiring Locks

```typescript
import { useUniRequest } from 'uniadapter'

async function criticalOperation(resourceId: string) {
  const request = useUniRequest()
  
  // Acquire distributed lock (30 second timeout)
  const locked = await request.post('/lock/acquire', {
    key: `resource_${resourceId}`,
    ttl: 30000
  })
  
  if (!locked) {
    throw new Error('Could not acquire lock')
  }
  
  try {
    // Perform protected operation
    await performOperation(resourceId)
  } finally {
    // Always release lock
    await request.post('/lock/release', {
      key: `resource_${resourceId}`
    })
  }
}
```

### Lock with Timeout

```typescript
async function acquireLockWithRetry(
  resourceId: string,
  maxRetries: number = 3
) {
  const request = useUniRequest()
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await request.post('/lock/acquire', {
        key: `resource_${resourceId}`,
        ttl: 30000
      })
      
      if (result.acquired) {
        return true
      }
    } catch (error) {
      console.error(`Lock attempt ${i + 1} failed:`, error)
    }
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return false
}
```

## Practical Examples

### User Authentication Flow

```typescript
async function authenticateUser(username: string, password: string) {
  const request = useUniRequest()
  
  try {
    // Call Go authentication service
    const response = await request.post('/rpc/AuthService/Login', {
      username,
      password
    })
    
    // Store token
    await localStorage.setItem('auth_token', response.token)
    
    // Publish auth event
    await publishUserEvent('authenticated', {
      username,
      timestamp: Date.now()
    })
    
    return response
  } catch (error) {
    console.error('Authentication failed:', error)
    throw error
  }
}
```

### Data Synchronization

```typescript
async function syncUserData(userId: string) {
  const request = useUniRequest()
  
  // Acquire lock to prevent concurrent syncs
  const lockKey = `sync_${userId}`
  const locked = await request.post('/lock/acquire', { key: lockKey, ttl: 10000 })
  
  if (!locked) return
  
  try {
    // Fetch from backend
    const data = await request.get('/rpc/UserService/GetData', { userId })
    
    // Update local state
    setUserData(data)
    
    // Publish sync event
    await publishUserEvent('synced', { userId })
  } finally {
    await request.post('/lock/release', { key: lockKey })
  }
}
```

### Service-to-Service Communication

```typescript
// Frontend initiates workflow across multiple services
async function createOrderWorkflow(order: Order) {
  const request = useUniRequest()
  
  try {
    // Call OrderService
    const orderResult = await request.post('/rpc/OrderService/Create', order)
    
    // Publish event for InventoryService
    await publishUserEvent('order.created', {
      orderId: orderResult.id,
      items: order.items
    })
    
    // Publish event for PaymentService
    await publishUserEvent('payment.required', {
      orderId: orderResult.id,
      amount: order.total
    })
    
    return orderResult
  } catch (error) {
    // Publish error event for rollback
    await publishUserEvent('order.failed', { error: error.message })
    throw error
  }
}
```

## Performance Considerations

1. **Connection pooling** - Reuse HTTP connections for RPC calls
2. **Request batching** - Combine multiple RPC calls into one request
3. **Caching** - Cache stable data locally with TTL
4. **Timeout handling** - Set appropriate timeouts for each RPC call
5. **Error recovery** - Implement exponential backoff for retries

## Monitoring & Debugging

### Logging RPC Calls

```typescript
import { useUniRequest } from 'uniadapter'

const originalPost = request.post
request.post = async (url, data, options) => {
  console.time(`RPC: ${url}`)
  try {
    const result = await originalPost(url, data, options)
    console.log(`✓ RPC: ${url}`, result)
    return result
  } catch (error) {
    console.error(`✗ RPC: ${url}`, error)
    throw error
  } finally {
    console.timeEnd(`RPC: ${url}`)
  }
}
```

### Health Dashboard

```typescript
async function getSystemHealth() {
  const request = useUniRequest()
  
  const services = ['UserService', 'OrderService', 'PaymentService']
  
  const health = await Promise.all(
    services.map(async (service) => ({
      service,
      healthy: await checkServiceHealth(service)
    }))
  )
  
  return health
}
```
