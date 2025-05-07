import { useEffect, useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
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

type BarChartOptions = ChartOptions<'bar'>;
type PieChartOptions = ChartOptions<'pie'>;

interface ChartDataState {
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

// Helper function to get computed CSS variables
const getCssVar = (varName: string) => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

export function Analytics() {
  const { theme } = useTheme()
  const { authorKey } = useAuthor()
  
  const [chartData, setChartData] = useState<ChartDataState>({
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
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      }]
    }
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

      // Process category data
      const categorySpending = transactions.reduce((acc: { [key: string]: number }, curr) => {
        const category = curr.description || 'Other'
        acc[category] = (acc[category] || 0) + parseFloat(String(curr.amount) || '0')
        return acc
      }, {})

      const sortedCategories = Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])

      const isDark = theme === 'dark';
      const pieBgColors = [
          isDark ? 'rgba(255, 99, 132, 0.7)' : 'rgba(255, 99, 132, 0.8)',
          isDark ? 'rgba(54, 162, 235, 0.7)' : 'rgba(54, 162, 235, 0.8)',
          isDark ? 'rgba(255, 206, 86, 0.7)' : 'rgba(255, 206, 86, 0.8)',
          isDark ? 'rgba(75, 192, 192, 0.7)' : 'rgba(75, 192, 192, 0.8)',
          isDark ? 'rgba(153, 102, 255, 0.7)' : 'rgba(153, 102, 255, 0.8)',
        ];
      const pieBorderColors = [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
      ];
      
      const newChartData: ChartDataState = {
        monthlyData: {
          labels: sortedMonths.map(([month]) => month),
          datasets: [{
            label: 'Monthly Spending',
            data: sortedMonths.map(([, amount]) => amount),
            backgroundColor: isDark ? 'rgba(75, 192, 192, 0.6)' : 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        },
        categoryData: {
          labels: sortedCategories.map(([category]) => category),
          datasets: [{
            data: sortedCategories.map(([, amount]) => amount),
            backgroundColor: pieBgColors,
            borderColor: pieBorderColors,
            borderWidth: 1,
          }]
        }
      };

      setChartData(newChartData)
    }

    loadData()
  }, [authorKey, theme])

  // Calculate options using useMemo, dependent on theme (triggering CSS variable read)
  const { barChartOptions, pieChartOptions } = useMemo(() => {
    // Read CSS variables dynamically
    const tickColor = getCssVar('--chart-tick-color');
    const gridColor = getCssVar('--chart-grid-color');
    const legendLabelColor = getCssVar('--chart-legend-label-color');
    const tooltipBgColor = getCssVar('--chart-tooltip-bg-color');
    const tooltipBorderColor = getCssVar('--chart-tooltip-border-color');
    const tooltipTitleColor = getCssVar('--chart-tooltip-title-color');
    const tooltipBodyColor = getCssVar('--chart-tooltip-body-color');
    
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: { color: legendLabelColor }
        },
        title: {
          display: true, 
          color: legendLabelColor,
          text: '' 
        },
        tooltip: {
          backgroundColor: tooltipBgColor,
          borderColor: tooltipBorderColor,
          borderWidth: 1,
          titleColor: tooltipTitleColor,
          bodyColor: tooltipBodyColor,
        }
      }
    };

    const barOpts: BarChartOptions = {
      ...commonOptions,
      plugins: { 
        legend: commonOptions.plugins.legend,
        title: { ...commonOptions.plugins.title, display: false },
        tooltip: commonOptions.plugins.tooltip,
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

    const pieOpts: PieChartOptions = {
      ...commonOptions,
      plugins: { 
        legend: commonOptions.plugins.legend,
        title: { ...commonOptions.plugins.title, display: false, text: 'Spending by Category' },
        tooltip: commonOptions.plugins.tooltip,
      },
    };
    
    return { barChartOptions: barOpts, pieChartOptions: pieOpts };

  }, [theme]); // Recalculate only when theme changes

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Spending Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 glass-card text-card-foreground rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
          <div style={{ height: '400px' }}>
            <Bar data={chartData.monthlyData} options={barChartOptions} key={`bar-${theme}`} />
          </div>
        </div>
        <div className="p-4 glass-card text-card-foreground rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <div style={{ height: '400px' }}>
            <Pie data={chartData.categoryData} options={pieChartOptions} key={`pie-${theme}`} />
          </div>
        </div>
      </div>
    </div>
  )
} 