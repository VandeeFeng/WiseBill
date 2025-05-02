import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 