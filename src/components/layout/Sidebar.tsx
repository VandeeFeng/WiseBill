import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CreditCard,
  PieChart,
  Settings,
  Wallet,
  ChevronLeft,
  Lock,
  Unlock,
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { AuthorKeyModal } from "@/components/AuthorKeyModal"
import { useAuthor } from "@/lib/AuthorContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Budgets", href: "/budgets", icon: Wallet },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [authorModalOpen, setAuthorModalOpen] = useState(false)
  const location = useLocation()
  const { authorKey } = useAuthor()

  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ease-in-out font-sans",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-24 items-center justify-between border-b border-border px-6 py-4">
          <span
            className={cn(
              "text-2xl font-bold transition-opacity duration-300 red-glow",
              isCollapsed && "opacity-0 hidden"
            )}
          >
            WiseBill
          </span>
          {isCollapsed ? (
            <span className="mx-auto text-3xl font-bold red-glow">W</span>
          ) : (
            <ThemeToggle />
          )}
        </div>
        
        <nav className="flex-1 p-3 flex flex-col space-y-3">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={cn("h-5 w-5", !isCollapsed && "mr-4")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
        
        <div className="border-t border-border p-3 mt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setAuthorModalOpen(true)}
                  className={cn(
                    "w-full flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors text-muted-foreground hover:bg-primary/5 hover:text-primary",
                    isCollapsed && "justify-center"
                  )}
                >
                  {authorKey ? (
                    <Unlock className={cn("h-5 w-5 text-green-500", !isCollapsed && "mr-4")} />
                  ) : (
                    <Lock className={cn("h-5 w-5 text-red-500", !isCollapsed && "mr-4")} />
                  )}
                  {!isCollapsed && <span>Author Key</span>}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{authorKey ? "Change/Clear Author Key" : "Set Author Key"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent",
          isCollapsed && "rotate-180"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <AuthorKeyModal open={authorModalOpen} onOpenChange={setAuthorModalOpen} />
    </div>
  )
} 