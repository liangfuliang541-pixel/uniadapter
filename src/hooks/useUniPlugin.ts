import { useState, useEffect, useRef } from 'react'
import {
  registerPlugin,
  getPlugin,
  listPlugins,
  onPluginEvent,
  activatePlugin,
  deactivatePlugin
} from '../core/plugin'

export function useUniPlugin(onEvent?: (payload: any) => void) {
  const [plugins, setPlugins] = useState(() => listPlugins())
  const cbRef = useRef(onEvent)
  cbRef.current = onEvent

  useEffect(() => {
    // subscribe to plugin changes via event emitter
    const unsubChanged = onPluginEvent('changed', (p) => {
      setPlugins(listPlugins())
      if (cbRef.current) cbRef.current(p)
    })
    const unsubAll = onPluginEvent('registered', (p) => cbRef.current && cbRef.current(p))

    return () => {
      if (typeof unsubChanged === 'function') unsubChanged()
      if (typeof unsubAll === 'function') unsubAll()
    }
  }, [])

  return {
    register: (plugin: any) => {
      registerPlugin(plugin)
      setPlugins(listPlugins())
    },
    get: (name: string) => getPlugin(name),
    list: () => plugins,
    activate: (name: string, options?: any) => activatePlugin(name, options),
    deactivate: (name: string, options?: any) => deactivatePlugin(name, options)
  }
}
