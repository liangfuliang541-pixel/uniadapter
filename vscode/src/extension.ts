/**
 * UniAdapter VibeDevTools - VS Code Extension
 * 
 * VS Code 内置的小程序 AI 开发 IDE
 * 集成 VibeEngine + VibeUI，让开发者在编辑器里用自然语言生成跨端代码
 */

import * as vscode from 'vscode'
import { VibeDevToolsProvider } from './VibeDevToolsView'
import { ComponentTreeProvider } from './ComponentTreeView'
import { registerCommands } from './commands'

const EXTENSION_NAME = 'UniAdapter VibeDevTools'

let vibeProvider: VibeDevToolsProvider
let componentTreeProvider: ComponentTreeProvider

export async function activate(context: vscode.ExtensionContext) {
  console.log('[' + EXTENSION_NAME + '] Activating...')

  // Register main webview
  vibeProvider = new VibeDevToolsProvider(context)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'uniadapter-vibe-devtools.view',
      vibeProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  )

  // Register component tree in explorer
  componentTreeProvider = new ComponentTreeProvider()
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      'uniadapter-vibe-devtools.components',
      componentTreeProvider
    )
  )

  // Register commands
  registerCommands(context, vibeProvider)

  // Welcome message on first activation
  const stateKey = 'uniadapter-vibe-devtools.firstActivation'
  const firstTime = context.globalState.get<boolean>(stateKey, true)
  if (firstTime) {
    context.globalState.update(stateKey, false)
    const action = await vscode.window.showInformationMessage(
      '\U0001F9CA ' + EXTENSION_NAME + ' 已激活！打开右侧面板开始 AI 开发。',
      '打开面板'
    )
    if (action === '打开面板') {
      vscode.commands.executeCommand('uniadapter-vibe-devtools.view.focus')
    }
  }

  console.log('[' + EXTENSION_NAME + '] Ready!')
}

export function deactivate() {
  console.log('[' + EXTENSION_NAME + '] Deactivated')
}
