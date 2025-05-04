import { useState, useEffect } from "react"
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
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authorModalOpen, setAuthorModalOpen] = useState(false)
  const location = useLocation()
  const { authorKey } = useAuthor()
  const [isMobile, setIsMobile] = useState(false);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-30 p-2 rounded-md bg-background border border-border shadow-sm transition-all duration-200 ease-linear"
      >
        <div className="relative w-5 h-5">
          <Menu className={`h-5 w-5 absolute top-0 left-0 transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <X className={`h-5 w-5 absolute top-0 left-0 transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </button>
      
      <div className="relative">
        <div
          className={cn(
            "flex h-screen flex-col bg-card",
            "transition-all duration-200 ease-linear",
            isMobile && isMobileMenuOpen && "transition-transform duration-300 ease-out",
            (!isCollapsed || isMobileMenuOpen) && "border-r border-border",
            isCollapsed ? "w-0 md:w-20" : "w-64",
            isMobileMenuOpen 
              ? "fixed inset-y-0 left-0 z-20 w-64 translate-x-0" 
              : "fixed inset-y-0 -translate-x-full md:translate-x-0 md:static md:flex"
          )}
        >
          <div className={cn(
            "flex h-24 items-center justify-between px-6 py-4",
            (!isCollapsed || isMobileMenuOpen) && "border-b border-border"
          )}>
            <span
              className={cn(
                "text-2xl font-bold transition-opacity duration-200 red-glow",
                isCollapsed && !isMobileMenuOpen && "opacity-0 hidden"
              )}
            >
              WiseBill
            </span>
            {isCollapsed && !isMobileMenuOpen ? (
              <span className="mx-auto text-3xl font-bold red-glow md:block hidden">W</span>
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
                    isCollapsed && !isMobileMenuOpen && "justify-center"
                  )}
                  title={isCollapsed && !isMobileMenuOpen ? item.name : undefined}
                >
                  <Icon className={cn("h-5 w-5", (!isCollapsed || isMobileMenuOpen) && "mr-4")} />
                  {(!isCollapsed || isMobileMenuOpen) && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>
          
          <div className={cn(
            "p-3 mt-2",
            (!isCollapsed || isMobileMenuOpen) && "border-t border-border"
          )}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setAuthorModalOpen(true)}
                    className={cn(
                      "w-full flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors text-muted-foreground hover:bg-primary/5 hover:text-primary",
                      isCollapsed && !isMobileMenuOpen && "justify-center"
                    )}
                  >
                    {authorKey ? (
                      <Unlock className={cn("h-5 w-5 text-green-500", (!isCollapsed || isMobileMenuOpen) && "mr-4")} />
                    ) : (
                      <Lock className={cn("h-5 w-5 text-red-500", (!isCollapsed || isMobileMenuOpen) && "mr-4")} />
                    )}
                    {(!isCollapsed || isMobileMenuOpen) && <span>Author Key</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{authorKey ? "Change/Clear Author Key" : "Set Author Key"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Toggle button - only visible on desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-[72px] items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent hidden md:flex h-6 w-6 transition-transform duration-200 ease-linear",
            isCollapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <AuthorKeyModal open={authorModalOpen} onOpenChange={setAuthorModalOpen} />
      </div>
      
      {/* Overlay for mobile menu */}
      <div 
        className={`fixed inset-0 bg-background/80 z-10 md:hidden ${
          isMobile && isMobileMenuOpen 
            ? 'transition-opacity duration-300 ease-out opacity-100 backdrop-blur-sm' 
            : 'transition-all duration-200 ease-linear opacity-0 backdrop-blur-none pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
} 