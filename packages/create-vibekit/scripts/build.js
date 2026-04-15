// Simple build script - copy source to dist
import { existsSync, mkdirSync, cpSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Ensure dist exists
mkdirSync(join(root, 'dist'), { recursive: true })

// Copy source
cpSync(join(root, 'src'), join(root, 'dist'), { recursive: true })

// Make it executable
import { chmodSync } from 'fs'
chmodSync(join(root, 'dist', 'index.mjs'), 0o755)

console.log('✅ create-vibekit built')
