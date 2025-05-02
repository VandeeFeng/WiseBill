import { useEffect, useState } from "react"

type Theme = "dark" | "light"

export function useTheme() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme") as Theme
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.add(stored)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.add("light")
    }
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
    return { theme: "dark", toggleTheme }
  }

  return { theme, toggleTheme }
} 