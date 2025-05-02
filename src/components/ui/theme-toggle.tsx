import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../hooks/use-theme"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="glass-effect p-2 rounded-lg transition-all duration-200 hover:shadow-glow"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-blue-500" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-500 transition-transform hover:rotate-90" />
      )}
    </button>
  )
} 