import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { getTransactions } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import type { Database } from '@/types/supabase'
import { useAuthor } from '@/lib/AuthorContext'

type Bill = Database['public']['Tables']['bill']['Row']

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const { authorKey } = useAuthor()

  async function loadTransactions() {
    try {
      setLoading(true)
      const data = await getTransactions(authorKey || undefined)
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [authorKey]) // Re-fetch when authorKey changes

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

  const formatDate = (dateStr: string) => {
    try {
      // First try ISO format
      if (dateStr.includes('T') || dateStr.includes('-')) {
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
          return format(date, 'MMM d, yyyy')
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
        return format(date, 'MMM d, yyyy')
      }

      return 'Invalid date'
    } catch (error) {
      console.error('Invalid date:', dateStr)
      return 'Invalid date'
    }
  }

  return (
    <div className="container py-10 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <TransactionForm onSuccess={loadTransactions} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {formatDate(transaction.消费时间)}
                  </TableCell>
                  <TableCell>{transaction.银行名称}</TableCell>
                  <TableCell>{transaction.消费用途}</TableCell>
                  <TableCell className="text-right font-medium">
                    ¥{formatAmount(transaction.消费金额)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 