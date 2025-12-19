import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContextValue'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    localStorage.setItem('theme', theme)
    const html = document.documentElement
    html.classList.toggle('dark', theme === 'dark')
    html.classList.toggle('theme-light', theme === 'light')
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme, toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
