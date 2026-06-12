import { useEffect } from 'react'

// ─── Force Light Theme Hook ───────────────────────────────────────────────────

export function useTheme() {
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('dark')
    root.classList.add('light')
  }, [])

  return {
    theme: 'light' as const,
    setTheme: () => {},
    toggleTheme: () => {},
    resolvedTheme: 'light' as const,
  }
}
