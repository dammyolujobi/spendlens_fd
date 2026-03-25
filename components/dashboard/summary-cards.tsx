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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
      <Card className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 border-red-200/30 dark:border-red-900/30 hover:from-red-100/60 hover:to-red-100/40 dark:hover:from-red-950/30 dark:hover:to-red-950/20 transition-smooth group">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300 group-hover:text-red-800 dark:group-hover:text-red-200 transition-colors">Total Spent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">₦{totalDebit.toFixed(2)}</div>
            <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-2">{transactions.filter(t => t.type === 'debit').length} transactions</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10 border-green-200/30 dark:border-green-900/30 hover:from-green-100/60 hover:to-green-100/40 dark:hover:from-green-950/30 dark:hover:to-green-950/20 transition-smooth group">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors">Total Received</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">₦{totalCredit.toFixed(2)}</div>
            <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-2">{transactions.filter(t => t.type === 'credit').length} transactions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
