# Getting Started

## Installation

```bash
npm install uniadapter
```

## Basic Usage

### Platform Detection

```typescript
import { detectPlatform, Platform } from 'uniadapter'

const platform = detectPlatform()

if (platform === Platform.WEAPP) {
  console.log('WeChat Mini Program')
}
```

### State Management

```typescript
import { useUniState } from 'uniadapter'

function Counter() {
  const [count, setCount] = useUniState(0)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

### Navigation

```typescript
import { useUniRouter } from 'uniadapter'

function Navigation() {
  const { push, replace, goBack } = useUniRouter()
  return (
    <>
      <button onClick={() => push('/home')}>Home</button>
      <button onClick={() => goBack()}>Back</button>
    </>
  )
}
```

### HTTP Requests

```typescript
import { useUniRequest } from 'uniadapter'

function DataFetch() {
  const { get, post, put, del } = useUniRequest()
  
  // GET request
  const data = await get('/api/users')
  
  // POST request
  await post('/api/users', { name: 'John' })
  
  // PUT request
  await put('/api/users/1', { name: 'Jane' })
  
  // DELETE request
  await del('/api/users/1')
}
```

## Common Patterns

### Conditional Rendering by Platform

```typescript
import { usePlatform } from 'uniadapter'

function Layout() {
  const { isMiniProgram } = usePlatform()
  
  return isMiniProgram ? <MobileLayout /> : <DesktopLayout />
}
```

### Data Fetching with Loading State

```typescript
function UserList() {
  const { get } = useUniRequest()
  const [loading, setLoading] = React.useState(false)
  const [users, setUsers] = React.useState([])
  
  React.useEffect(() => {
    setLoading(true)
    get('/api/users')
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <p>Loading...</p>
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### Error Handling

```typescript
async function fetchData() {
  try {
    const data = await request.get('/api/data')
    return data
  } catch (error) {
    console.error('Request failed:', error)
    return null
  }
}
```

### Custom Hook for Data Fetching

```typescript
function useFetch(url) {
  const { get } = useUniRequest()
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  
  React.useEffect(() => {
    get(url)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])
  
  return { data, loading, error }
}
```

## Type Safety

Full TypeScript support with complete type inference:

```typescript
interface User {
  id: number
  name: string
  email: string
}

function UserManager() {
  const request = useUniRequest()
  
  const getUser = async (id: number): Promise<User> => {
    return request.get(`/api/user/${id}`)
  }
  
  const updateUser = async (user: User): Promise<void> => {
    await request.put(`/api/user/${user.id}`, user)
  }
}
```

## Go Distributed Systems

### Microservice RPC Calls

```typescript
import { useUniRequest } from 'uniadapter'

function ServiceConsumer() {
  const request = useUniRequest()
  
  // Call Go microservice RPC endpoint
  const result = await request.post('/rpc/UserService/GetProfile', {
    userId: '123'
  })
  
  return <div>{result.name}</div>
}
```

### Message Queue Publishing

```typescript
import { useUniRequest } from 'uniadapter'

async function publishEvent(eventType, payload) {
  const request = useUniRequest()
  
  await request.post('/mq/publish', {
    topic: `user.${eventType}`,
    data: payload
  })
}
```

## Performance Tips

1. Use React.memo for expensive components
2. Lazy load route components
3. Minimize re-renders with useCallback
4. Cache API responses when appropriate
5. Profile with platform-specific DevTools

## Testing

### Basic Test

```typescript
import { describe, it, expect } from 'vitest'
import { useUniState } from 'uniadapter'

describe('Counter', () => {
  it('should increment', () => {
    const [count, setCount] = useUniState(0)
    setCount(1)
    expect(count).toBe(1)
  })
})
```

### Mocking Requests

```typescript
import { vi } from 'vitest'

describe('UserList', () => {
  it('should fetch and display users', async () => {
    const mockFetch = vi.fn(() => 
      Promise.resolve([{ id: 1, name: 'John' }])
    )
    
    // Test component with mocked request
  })
})
```

## Troubleshooting

### Request fails in mini-program
- Verify endpoint is in mini-program's allowlist
- Check that HTTPS is being used
- Review mini-program's actual request API

### State not updating
- Ensure you're calling the setter, not mutating state
- Check useEffect dependencies
- Use React DevTools to inspect

### Navigation not working
- Verify route path exists
- Check platform-specific requirements
- Use goBack() for in-app navigation
