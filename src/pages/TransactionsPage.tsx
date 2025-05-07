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
import { getTransactions, updateTransaction } from '@/lib/api'
import { Loader2, Calendar, Building2, Lock, LockOpen, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Database } from '@/types/supabase'
import { useAuthor } from '@/lib/AuthorContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

type Bill = Database['public']['Tables']['bill']['Row']

const ITEMS_PER_PAGE = 20

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{
    account?: string
    amount?: number
    date?: string
    description?: string | null
  }>({})
  const [currentPage, setCurrentPage] = useState(1)
  const { authorKey } = useAuthor()
  const { toast } = useToast()

  async function loadTransactions() {
    try {
      setLoading(true)
      const data = await getTransactions(authorKey || undefined)
      setTransactions(data.map(transaction => ({
        ...transaction,
        id: String(transaction.id)
      })))
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
              <div className="font-medium truncate max-w-[65%]">{transaction.description}</div>
              <div className="font-bold text-right">¥{formatAmount(transaction.amount)}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {formatDate(transaction.date)}
              </div>
              <div className="flex items-center">
                <Building2 className="h-3.5 w-3.5 mr-1.5" />
                {transaction.account}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const handleEdit = (transaction: Bill) => {
    if (!isEditMode) return
    setEditingId(transaction.id)
    setEditValues({
      account: transaction.account,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description
    })
  }

  const handleSave = async (id: string) => {
    try {
      await updateTransaction(id, editValues, authorKey || undefined)
      await loadTransactions()
      setEditingId(null)
      toast({
        title: 'Success',
        description: 'Transaction updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update transaction',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const renderEditableCell = (transaction: Bill, field: keyof Bill) => {
    if (editingId !== transaction.id) {
      return field === 'date' ? formatDate(transaction[field]) :
             field === 'amount' ? `¥${formatAmount(transaction[field])}` :
             transaction[field]
    }

    switch (field) {
      case 'account':
        return (
          <Input
            value={editValues.account ?? ''}
            onChange={(e) => setEditValues({ ...editValues, account: e.target.value })}
            className="w-[130px]"
          />
        )
      case 'amount':
        return (
          <Input
            value={editValues.amount?.toString() ?? ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '')
              setEditValues({ ...editValues, amount: value ? parseFloat(value) : undefined })
            }}
            className="w-[100px]"
          />
        )
      case 'date':
        return (
          <Input
            type="date"
            value={editValues.date?.split('T')[0]}
            onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
            className="w-[130px]"
          />
        )
      case 'description':
        return (
          <Input
            value={editValues.description === null ? '' : editValues.description ?? ''}
            onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
            className="w-[200px]"
          />
        )
      default:
        return transaction[field]
    }
  }

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTransactions = transactions.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    if (editingId) {
      handleCancel()
    }
    setCurrentPage(newPage)
  }

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (isEditMode && editingId) {
                handleCancel()
              }
              setIsEditMode(!isEditMode)
            }}
            className={isEditMode ? 'bg-primary text-primary-foreground' : ''}
          >
            {isEditMode ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </Button>
        </div>
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
              <TableHead className="whitespace-nowrap">Account</TableHead>
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
            ) : currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className={isEditMode ? 'cursor-pointer hover:bg-muted/50 relative' : ''}
                  onClick={() => handleEdit(transaction)}
                >
                  <TableCell className="whitespace-nowrap">
                    {renderEditableCell(transaction, 'date')}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {renderEditableCell(transaction, 'account')}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate lg:max-w-none lg:whitespace-normal">
                    {renderEditableCell(transaction, 'description')}
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap">
                    {renderEditableCell(transaction, 'amount')}
                  </TableCell>
                  {isEditMode && editingId === transaction.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSave(transaction.id)
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCancel()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
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

      {/* Pagination */}
      {!loading && transactions.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 