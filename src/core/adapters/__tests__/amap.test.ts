import { describe, it, expect, vi } from 'vitest'
import { 
  GaodeStorageAdapter,
  GaodeLocationAdapter,
  GaodeMapAdapter
} from '../amap'

describe('Gaode Map Adapters', () => {
  // Mock 高德地图API
  beforeEach(() => {
    vi.resetModules()
    
    // Create proper constructor functions
    class MockGeolocation {
      getCurrentPosition = vi.fn((callback) => {
        callback(null, {
          position: { lng: 116.404, lat: 39.915 },
          accuracy: 50
        })
      })
    }
    
    class MockPlaceSearch {
      search = vi.fn((keyword, callback) => {
        callback(null, {
          poiList: {
            pois: [
              { id: '1', name: '测试地点', location: { lng: 116.404, lat: 39.915 } }
            ]
          }
        })
      })
    }
    
    class MockDriving {
      search = vi.fn((start, end, callback) => {
        callback(null, {
          routes: [{
            distance: 1000,
            duration: 300,
            steps: []
          }]
        })
      })
    }
    
    global.AMap = {
      plugin: vi.fn(),
      Geolocation: MockGeolocation,
      PlaceSearch: MockPlaceSearch,
      Driving: MockDriving
    }
  })

  it('should create GaodeStorageAdapter', () => {
    const adapter = new GaodeStorageAdapter()
    expect(adapter.platform).toBe('amap')
  })

  it('should handle location services', async () => {
    const adapter = new GaodeLocationAdapter()
    const position = await adapter.getCurrentPosition()
    
    expect(position).toEqual({
      longitude: 116.404,
      latitude: 39.915,
      accuracy: 50
    })
  })

  it('should search for places', async () => {
    const adapter = new GaodeMapAdapter()
    const results = await adapter.searchPlaces('测试地点')
    
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('测试地点')
  })

  it('should calculate route', async () => {
    const adapter = new GaodeMapAdapter()
    const route = await adapter.calculateRoute(
      { lng: 116.404, lat: 39.915 },
      { lng: 116.405, lat: 39.916 }
    )
    
    expect(route.distance).toBe(1000)
    expect(route.duration).toBe(300)
  })
})