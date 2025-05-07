import { useEffect, useState, useMemo } from 'react'
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
  ChartOptions,
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
type BarChartOptions = ChartOptions<'bar'>;

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

// Helper function to get computed CSS variables
const getCssVar = (varName: string) => {
  if (typeof window === 'undefined') return ''; // Guard for SSR
  // Need to trim() because getPropertyValue returns the value with spaces/newlines sometimes
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

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
        const month = formatDate(curr.date)
        if (month !== 'Invalid date') {
          acc[month] = (acc[month] || 0) + parseFloat(String(curr.amount) || '0')
        }
        return acc
      }, {})

      // Sort months chronologically and get last 6 months
      const sortedMonths = Object.entries(monthlySpending)
        .sort((a, b) => {
          try {
            const dateA = new Date(a[0])
            const dateB = new Date(b[0])
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0
            return dateA.getTime() - dateB.getTime()
          } catch (e) {
            console.error("Error parsing date for sorting:", a[0], b[0])
            return 0
          }
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
  }, [authorKey, theme])

  // Calculate options using useMemo, dependent on theme (triggering CSS variable read)
  const chartOptions = useMemo<BarChartOptions>(() => {
    // Read CSS variables dynamically based on the current theme applied to the document
    const tickColor = getCssVar('--chart-tick-color');
    const gridColor = getCssVar('--chart-grid-color');
    const legendLabelColor = getCssVar('--chart-legend-label-color'); // Read legend color again
    const tooltipBgColor = getCssVar('--chart-tooltip-bg-color');
    const tooltipBorderColor = getCssVar('--chart-tooltip-border-color');
    const tooltipTitleColor = getCssVar('--chart-tooltip-title-color');
    const tooltipBodyColor = getCssVar('--chart-tooltip-body-color');

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: false, // Keep legend hidden for preview
          labels: { color: legendLabelColor } // Explicitly set legend label color
        },
        title: { 
          display: false, 
          color: legendLabelColor // Explicitly set title color
        },
        tooltip: {
          backgroundColor: tooltipBgColor,
          borderColor: tooltipBorderColor,
          borderWidth: 1,
          titleColor: tooltipTitleColor,
          bodyColor: tooltipBodyColor,
        }
      },
      scales: {
        x: { 
          ticks: { color: tickColor }, 
          grid: { color: gridColor } 
        },
        y: { 
          beginAtZero: true, 
          ticks: { color: tickColor }, 
          grid: { color: gridColor } 
        }
      }
    };
  // Recalculate when theme changes, because CSS vars will have changed
  }, [theme]);

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
      <div style={{ height: '300px' }}>
         <Bar data={monthlyData} options={chartOptions} key={theme} />
      </div>
    </div>
  )
} 