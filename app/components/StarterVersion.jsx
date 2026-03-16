'use client'

import { useEffect, useState } from 'react'

/**
 * Fetches and displays version from package.json in a GitHub repository.
 * @param {string} repo - Repository in format "owner/repo" (e.g. "Bystrol/astro-medusa-starter")
 * @param {string} [branch='main'] - Branch to fetch from
 * @param {string} [fallback] - Fallback version when fetch fails
 */
export function StarterVersion({ repo, branch = 'main', fallback = '—' }) {
  const [version, setVersion] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!repo) return

    const url = `https://raw.githubusercontent.com/${repo}/${branch}/package.json`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((pkg) => setVersion(pkg.version || fallback))
      .catch(() => setError(true))
  }, [repo, branch, fallback])

  if (error) return <span>{fallback}</span>
  if (version === null) return <span className="opacity-60">…</span>
  return <span>{version}</span>
}
