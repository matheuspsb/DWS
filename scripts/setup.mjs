import { execSync } from 'node:child_process'
import { existsSync, statSync, utimesSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const MIN_NODE = { major: 22, minor: 12 }

const forced = process.env.FORCE_COLOR
const useColor = forced ? forced !== '0' : process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code) => (text) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text)
const bold = paint('1')
const dim = paint('2')
const green = paint('32')
const red = paint('31')
const cyan = paint('36')

const run = (command, options) => execSync(command, { cwd: root, stdio: 'inherit', ...options })

const fail = (title, details) => {
  console.error(`\n  ${red(`✘ ${title}`)}\n`)
  if (details) console.error(`${details}\n`)
  process.exit(1)
}

const closingMessages = {
  prestart: 'Starting the dev server...',
  predev: 'Starting the dev server...',
  prebuild: 'Building for production...',
}

const hasSupportedNode = () => {
  const [major, minor] = process.versions.node.split('.').map(Number)
  return major > MIN_NODE.major || (major === MIN_NODE.major && minor >= MIN_NODE.minor)
}

const needsInstall = () => {
  const lockfile = join(root, 'package-lock.json')
  const installed = join(root, 'node_modules', '.package-lock.json')
  if (!existsSync(installed)) return true
  return existsSync(lockfile) && statSync(lockfile).mtimeMs > statSync(installed).mtimeMs
}

const readableError = (output) =>
  output
    .split('\n')
    .filter((line) => !/^\s+at |^file:\/\/|throw new Error|^\s*\^|^Node\.js v/.test(line))
    .join('\n')
    .trim()

const closing = closingMessages[process.env.npm_lifecycle_event]
const dependenciesMissing = needsInstall()

if (closing || dependenciesMissing) console.log(`\n  ${bold(cyan('DWS Blog'))}\n`)

if (!hasSupportedNode()) {
  fail(
    `Node ${MIN_NODE.major}.${MIN_NODE.minor} or newer is required (found ${process.versions.node})`,
    '  Install a newer Node version (https://nodejs.org) and try again.',
  )
}

if (dependenciesMissing) {
  console.log(`  ${cyan('Installing dependencies')}, this may take a minute...\n`)
  try {
    run(existsSync(join(root, 'package-lock.json')) ? 'npm ci' : 'npm install')
  } catch {
    fail('Failed to install dependencies', '  Check your internet connection and run "npm install" manually.')
  }
  const marker = join(root, 'node_modules', '.package-lock.json')
  if (existsSync(marker)) utimesSync(marker, new Date(), new Date())
  console.log(`\n  ${green('✔')} Dependencies installed`)
}

if (!closing) process.exit(0)

try {
  run('npm run tokens --silent', { stdio: 'pipe' })
  console.log(`  ${green('✔')} Design tokens generated`)
} catch (error) {
  fail(
    'Failed to generate design tokens',
    `${readableError(`${error.stdout ?? ''}${error.stderr ?? ''}`)}\n\n  Run "npm run tokens -- --verbose" for details.`,
  )
}

console.log(`  ${dim(closing)}\n`)
