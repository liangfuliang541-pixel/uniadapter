/**
 * Build script for UniAdapter MCP Server
 * Bundles the MCP server into a standalone executable for Node.js
 */
import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const outDir = join(rootDir, 'dist', 'mcp')
mkdirSync(outDir, { recursive: true })

console.log('Building UniAdapter MCP Server...')

// Use esbuild to bundle the MCP server
try {
  execSync(
    `node "${rootDir}/node_modules/esbuild/lib/main.js" "${rootDir}/src/mcp/index.ts" ` +
    `--bundle ` +
    `--platform=node ` +
    `--outfile="${join(outDir, 'index.js')}" ` +
    `--external:@modelcontextprotocol/sdk ` +
    `--format=esm ` +
    `--target=node18 ` +
    `--sourcemap ` +
    `--log-level=info`,
    { stdio: 'inherit' }
  )
} catch (e) {
  console.error('Build failed:', e.message)
  process.exit(1)
}

console.log('✅ MCP Server built at dist/mcp/index.js')
console.log('')
console.log('Usage:')
console.log('  node dist/mcp/index.js')
console.log('')
console.log('Or install globally and run:')
console.log('  npm install -g @liangfu/uniadapter')
console.log('  uniadapter-mcp')
