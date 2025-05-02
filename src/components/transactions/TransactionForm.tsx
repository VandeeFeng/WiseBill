import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Plus } from 'lucide-react'
import { createTransaction } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuthor } from '@/lib/AuthorContext'

const formSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
})

interface TransactionFormProps {
  onSuccess?: () => void
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { authorKey } = useAuthor()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!authorKey) {
        toast({
          title: 'Error',
          description: 'Author key is required to add transactions. Please set it in the sidebar.',
          variant: 'destructive',
        })
        return
      }
      
      await createTransaction({
        银行名称: values.bankName,
        消费金额: parseFloat(values.amount),
        消费时间: values.date,
        消费用途: values.description || null,
      }, authorKey)
      
      toast({
        title: 'Success',
        description: 'Transaction created successfully',
      })
      
      setOpen(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create transaction:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create transaction',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!authorKey}>
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        {!authorKey ? (
          <div className="text-center py-4 text-muted-foreground">
            Author key is required to add transactions. 
            <br />
            Please set it using the button in the sidebar.
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="招商银行">招商银行</SelectItem>
                        <SelectItem value="工商银行">工商银行</SelectItem>
                        <SelectItem value="建设银行">建设银行</SelectItem>
                        <SelectItem value="农业银行">农业银行</SelectItem>
                        <SelectItem value="中国银行">中国银行</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Transaction</Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
} 