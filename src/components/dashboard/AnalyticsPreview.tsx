import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getTransactions } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { PieChart } from 'lucide-react'
import { format } from 'date-fns'
import { useTheme } from '@/hooks/use-theme'
import { useAuthor } from '@/lib/AuthorContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type MonthlyChartData = ChartData<'bar', number[], string>

const formatDate = (dateStr: string) => {
  try {
    // First try ISO format
    if (dateStr.includes('T') || dateStr.includes('-')) {
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return format(date, 'MMM yyyy')
      }
    }
    
    // Handle Chinese format (MM月DD日HH:mm)
    const match = dateStr.match(/(\d{2})月(\d{2})日(\d{2}):(\d{2})/)
    if (match) {
      const [, month, day, hour, minute] = match
      const date = new Date()
      date.setMonth(parseInt(month) - 1)
      date.setDate(parseInt(day))
      date.setHours(parseInt(hour))
      date.setMinutes(parseInt(minute))
      return format(date, 'MMM yyyy')
    }

    return 'Invalid date'
  } catch (error) {
    console.error('Invalid date:', dateStr)
    return 'Invalid date'
  }
}

export function AnalyticsPreview() {
  const { theme } = useTheme()
  const { authorKey } = useAuthor()
  const [monthlyData, setMonthlyData] = useState<MonthlyChartData>({
    labels: [],
    datasets: [{
      label: 'Monthly Spending',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  })

  useEffect(() => {
    async function loadData() {
      const transactions = await getTransactions(authorKey || undefined)
      
      // Process monthly data
      const monthlySpending = transactions.reduce((acc: { [key: string]: number }, curr) => {
        const month = formatDate(curr.消费时间)
        if (month !== 'Invalid date') {
          acc[month] = (acc[month] || 0) + parseFloat(String(curr.消费金额) || '0')
        }
        return acc
      }, {})

      // Sort months chronologically and get last 6 months
      const sortedMonths = Object.entries(monthlySpending)
        .sort((a, b) => {
          const dateA = new Date(a[0])
          const dateB = new Date(b[0])
          return dateA.getTime() - dateB.getTime()
        })
        .slice(-6)

      setMonthlyData({
        labels: sortedMonths.map(([month]) => month),
        datasets: [{
          label: 'Monthly Spending',
          data: sortedMonths.map(([, amount]) => amount),
          backgroundColor: theme === 'dark' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      })
    }

    loadData()
  }, [theme, authorKey])

  // Define chart options dynamically based on theme
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: theme === 'dark' ? '#ffffff' : '#333333',
        }
      },
      title: {
        display: false,
        color: theme === 'dark' ? '#ffffff' : '#333333',
      },
      tooltip: {
        titleColor: theme === 'dark' ? '#ffffff' : '#333333',
        bodyColor: theme === 'dark' ? '#dddddd' : '#666666',
        backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#666666',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#666666',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      }
    }
  }

  return (
    <div className="p-4 glass-card text-card-foreground rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Spending Trends</h3>
        <Button variant="outline" size="sm" asChild>
          <Link to="/analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Full Analytics</span>
          </Link>
        </Button>
      </div>
      <Bar data={monthlyData} options={chartOptions} />
    </div>
  )
} 