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
import { Loader2, Calendar, Building2 } from 'lucide-react'
import type { Database } from '@/types/supabase'
import { useAuthor } from '@/lib/AuthorContext'
import { Card } from '@/components/ui/card'

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

  // Mobile card view for transactions
  const renderMobileCards = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          No transactions found
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium truncate max-w-[65%]">{transaction.消费用途}</div>
              <div className="font-bold text-right">¥{formatAmount(transaction.消费金额)}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {formatDate(transaction.消费时间)}
              </div>
              <div className="flex items-center">
                <Building2 className="h-3.5 w-3.5 mr-1.5" />
                {transaction.银行名称}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
        <TransactionForm onSuccess={loadTransactions} />
      </div>

      {/* Mobile card view (only shows on small screens) */}
      <div className="md:hidden">
        {renderMobileCards()}
      </div>

      {/* Table view (hidden on mobile, shown on tablets and larger) */}
      <div className="rounded-md border overflow-x-auto hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Bank</TableHead>
              <TableHead className="whitespace-nowrap">Description</TableHead>
              <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
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
                  <TableCell className="whitespace-nowrap">
                    {formatDate(transaction.消费时间)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{transaction.银行名称}</TableCell>
                  <TableCell className="max-w-[200px] truncate lg:max-w-none lg:whitespace-normal">
                    {transaction.消费用途}
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap">
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