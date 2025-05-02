import { Analytics } from "@/components/Analytics"

export function AnalyticsPage() {
  return (
    <div className="space-y-4 font-sans">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Visualize your spending patterns
        </p>
      </div>
      <Analytics />
    </div>
  )
} 