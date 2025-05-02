import { Overview } from "@/components/dashboard/Overview"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { AnalyticsPreview } from "@/components/dashboard/AnalyticsPreview"

export function Dashboard() {
  return (
    <div className="space-y-6 md:space-y-8 font-sans">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Here's an overview of your finances
        </p>
      </div>
      <Overview />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-2 lg:col-span-4">
          <RecentTransactions />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <AnalyticsPreview />
        </div>
      </div>
    </div>
  )
} 