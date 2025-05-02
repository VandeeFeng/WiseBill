import { Card } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react"

const stats = [
  {
    name: "Total Balance",
    value: "$23,456",
    change: "+2.5%",
    trend: "up",
  },
  {
    name: "Monthly Spending",
    value: "$3,456",
    change: "-12%",
    trend: "down",
  },
  {
    name: "Monthly Savings",
    value: "$890",
    change: "+5%",
    trend: "up",
  },
]

export function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            {stat.trend === "up" ? (
              <ArrowUpIcon className="h-4 w-4 text-success" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-danger" />
            )}
          </div>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p
              className={`ml-2 text-sm font-medium ${
                stat.trend === "up" ? "text-success" : "text-danger"
              }`}
            >
              {stat.change}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
} 