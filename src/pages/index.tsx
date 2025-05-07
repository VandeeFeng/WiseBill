import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ThemeToggle } from "../components/ui/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Wisebill
            </h1>
            <p className="text-lg text-muted-foreground">
              Your smart financial assistant
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card hover>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access your most used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Add Transaction", "View Reports", "Manage Budget", "Settings"].map((action) => (
                  <button
                    key={action}
                    className="w-full glass-effect p-4 rounded-lg text-left hover:bg-accent/10 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card gradient hover>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>Your financial snapshot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Spending</span>
                  <span className="font-semibold">$2,450.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Income</span>
                  <span className="font-semibold">$5,000.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Savings</span>
                  <span className="font-semibold text-green-400">$2,550.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
} 