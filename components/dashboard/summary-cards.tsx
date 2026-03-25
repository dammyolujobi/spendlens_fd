import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Transaction {
  from: string
  amount: string
  date: string
  subject: string
  type: 'credit' | 'debit'
}

interface Props {
  transactions: Transaction[]
}

export default function SummaryCards({ transactions }: Props) {
  const totalDebit = transactions.reduce((sum, t) => {
    if (t.type !== 'debit') return sum
    const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ''))
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)

  const totalCredit = transactions.reduce((sum, t) => {
    if (t.type !== 'credit') return sum
    const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ''))
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 border-red-200/30 dark:border-red-900/30 hover:shadow-xl transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Total Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">₦{totalDebit.toFixed(2)}</div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{transactions.filter(t => t.type === 'debit').length} debits</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10 border-green-200/30 dark:border-green-900/30 hover:shadow-xl transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Total Received</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">₦{totalCredit.toFixed(2)}</div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{transactions.filter(t => t.type === 'credit').length} credits</p>
        </CardContent>
      </Card>
    </div>
  )
}
