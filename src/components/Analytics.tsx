import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { getTransactions } from '../lib/api'
import { format } from 'date-fns'
import { useTheme } from '@/hooks/use-theme'
import { useAuthor } from '@/lib/AuthorContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface ChartData {
  monthlyData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
      borderColor: string
      borderWidth: number
    }[]
  }
  categoryData: {
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor: string[]
      borderColor: string[]
      borderWidth: number
    }[]
  }
}

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

export function Analytics() {
  const { theme } = useTheme()
  const { authorKey } = useAuthor()
  const [chartData, setChartData] = useState<ChartData>({
    monthlyData: {
      labels: [],
      datasets: [{
        label: 'Monthly Spending',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    },
    categoryData: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          theme === 'dark' ? 'rgba(255, 99, 132, 0.7)' : 'rgba(255, 99, 132, 0.8)',
          theme === 'dark' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(54, 162, 235, 0.8)',
          theme === 'dark' ? 'rgba(255, 206, 86, 0.7)' : 'rgba(255, 206, 86, 0.8)',
          theme === 'dark' ? 'rgba(75, 192, 192, 0.7)' : 'rgba(75, 192, 192, 0.8)',
          theme === 'dark' ? 'rgba(153, 102, 255, 0.7)' : 'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          theme === 'dark' ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 1)',
          theme === 'dark' ? 'rgba(54, 162, 235, 1)' : 'rgba(54, 162, 235, 1)',
          theme === 'dark' ? 'rgba(255, 206, 86, 1)' : 'rgba(255, 206, 86, 1)',
          theme === 'dark' ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 1)',
          theme === 'dark' ? 'rgba(153, 102, 255, 1)' : 'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }]
    }
  })

  useEffect(() => {
    async function loadData() {
      const transactions = await getTransactions(authorKey || undefined)
      
      // Process monthly data
      const monthlySpending = transactions.reduce((acc: { [key: string]: number }, curr) => {
        const month = formatDate(curr.消费时间)
        if (month !== 'Invalid date') {
          acc[month] = (acc[month] || 0) + curr.消费金额
        }
        return acc
      }, {})

      const sortedMonths = Object.entries(monthlySpending)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())

      // Process category data
      const categorySpending = transactions.reduce((acc: { [key: string]: number }, curr) => {
        const category = curr.消费用途 || 'Other'
        acc[category] = (acc[category] || 0) + curr.消费金额
        return acc
      }, {})

      const sortedCategories = Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])

      setChartData({
        monthlyData: {
          labels: sortedMonths.map(([month]) => month),
          datasets: [{
            label: 'Monthly Spending',
            data: sortedMonths.map(([, amount]) => amount),
            backgroundColor: theme === 'dark' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        },
        categoryData: {
          labels: sortedCategories.map(([category]) => category),
          datasets: [{
            data: sortedCategories.map(([, amount]) => amount),
            backgroundColor: [
              theme === 'dark' ? 'rgba(255, 99, 132, 0.7)' : 'rgba(255, 99, 132, 0.8)',
              theme === 'dark' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(54, 162, 235, 0.8)',
              theme === 'dark' ? 'rgba(255, 206, 86, 0.7)' : 'rgba(255, 206, 86, 0.8)',
              theme === 'dark' ? 'rgba(75, 192, 192, 0.7)' : 'rgba(75, 192, 192, 0.8)',
              theme === 'dark' ? 'rgba(153, 102, 255, 0.7)' : 'rgba(153, 102, 255, 0.8)',
            ],
            borderColor: [
              theme === 'dark' ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 1)',
              theme === 'dark' ? 'rgba(54, 162, 235, 1)' : 'rgba(54, 162, 235, 1)',
              theme === 'dark' ? 'rgba(255, 206, 86, 1)' : 'rgba(255, 206, 86, 1)',
              theme === 'dark' ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 1)',
              theme === 'dark' ? 'rgba(153, 102, 255, 1)' : 'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          }]
        }
      })
    }

    loadData()
  }, [theme, authorKey])

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#ffffff' : '#333333',
        }
      },
      title: {
        display: true,
        color: theme === 'dark' ? '#ffffff' : '#333333',
      },
      tooltip: {
        titleColor: theme === 'dark' ? '#ffffff' : '#333333',
        bodyColor: theme === 'dark' ? '#dddddd' : '#666666',
        backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        borderWidth: 1,
      }
    }
  }

  const barChartOptions = {
    ...commonOptions,
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

  const pieChartOptions = {
    ...commonOptions,
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Spending Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 glass-card text-card-foreground rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
          <Bar data={chartData.monthlyData} options={barChartOptions} />
        </div>
        <div className="p-4 glass-card text-card-foreground rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <Pie data={chartData.categoryData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  )
} 