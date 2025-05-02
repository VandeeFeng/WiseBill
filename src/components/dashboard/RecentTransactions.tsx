import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShoppingBag, Coffee, Car, Home, CreditCard, Loader2 } from "lucide-react"
import { getTransactions } from "@/lib/api"
import { format } from "date-fns"
import { useAuthor } from "@/lib/AuthorContext"

// Icon mapping for different categories
const categoryIcons: { [key: string]: any } = {
  "购物": ShoppingBag,
  "餐饮": Coffee,
  "交通": Car,
  "住房": Home,
  "其他": CreditCard,
}

const formatDate = (dateStr: string) => {
  try {
    // First try ISO format
    if (dateStr.includes('T') || dateStr.includes('-')) {
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
          return 'Today'
        } else if (date.toDateString() === yesterday.toDateString()) {
          return 'Yesterday'
        } else {
          return format(date, 'MMM d')
        }
      }
    }
    
    // Handle Chinese format (MM月DD日HH:mm)
    const match = dateStr.match(/(\d{2})月(\d{2})日(\d{2}):(\d{2})/)
    if (match) {
      const [, month, day] = match
      const date = new Date()
      date.setMonth(parseInt(month) - 1)
      date.setDate(parseInt(day))
      return format(date, 'MMM d')
    }

    return 'Invalid date'
  } catch (error) {
    console.error('Invalid date:', dateStr)
    return 'Invalid date'
  }
}

const formatAmount = (amount: string | number) => {
  if (typeof amount === 'string') {
    // Remove any non-numeric characters except decimal point
    const cleanAmount = amount.replace(/[^0-9.]/g, '')
    return parseFloat(cleanAmount).toFixed(2)
  }
  if (typeof amount === 'number') {
    return amount.toFixed(2)
  }
  return '0.00'
}

interface Transaction {
  id: number
  银行名称: string
  消费金额: string | number
  消费时间: string
  消费用途: string | null
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { authorKey } = useAuthor()

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true)
        const data = await getTransactions(authorKey || undefined)
        // Get only the 5 most recent transactions
        setTransactions(data.slice(0, 5))
      } catch (error) {
        console.error('Failed to load transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [authorKey]) // Re-fetch when authorKey changes

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const category = transaction.消费用途 || "其他"
              const Icon = categoryIcons[category] || CreditCard
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-100 p-2">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.银行名称}</p>
                      <p className="text-xs text-gray-500">{category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-danger">
                      -¥{formatAmount(transaction.消费金额)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.消费时间)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 