import { useEffect, useState } from "react"

type Theme = "dark" | "light"

export function useTheme() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    let initialTheme: Theme = "dark"
    const stored = localStorage.getItem("theme") as Theme
    if (stored) {
      initialTheme = stored
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initialTheme = "dark"
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      initialTheme = "light"
    }
    
    setTheme(initialTheme)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(initialTheme)
    setMounted(true)

  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  if (!mounted) {
    let initialTheme: Theme = "dark"
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("theme") as Theme
      if (stored) {
        initialTheme = stored
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        initialTheme = "dark"
      } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        initialTheme = "light"
      }
    }
    return { theme: initialTheme, toggleTheme: () => {}, mounted }
  }

  return { theme, toggleTheme, mounted }
} 