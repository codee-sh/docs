import type { MetadataRoute } from 'next'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const SITE_URL = 'https://docs.codee.dev'
const CONTENT_DIR = join(process.cwd(), 'content')

function walk(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []
  for (const entry of entries) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      files.push(...walk(full))
    } else {
      files.push(full)
    }
  }
  return files
}

function toRoute(filePath: string): string | null {
  const rel = relative(CONTENT_DIR, filePath)
  if (rel.startsWith('..')) return null
  if (!rel.endsWith('.mdx') && !rel.endsWith('.md')) return null

  const normalized = rel.replace(/\\/g, '/')
  if (normalized.endsWith('_meta.json') || normalized.endsWith('_meta.js')) return null

  const noExt = normalized.replace(/\.(mdx|md)$/, '')
  if (noExt === 'index') return '/'
  if (noExt.endsWith('/index')) {
    return '/' + noExt.slice(0, -'/index'.length)
  }
  return '/' + noExt
}

export default function sitemap(): MetadataRoute.Sitemap {
  const files = walk(CONTENT_DIR)
  const routes = new Set<string>()

  for (const file of files) {
    const route = toRoute(file)
    if (route) routes.add(route)
  }

  return Array.from(routes)
    .sort()
    .map((path) => ({
      url: `${SITE_URL}${path === '/' ? '' : path}`,
    }))
}
