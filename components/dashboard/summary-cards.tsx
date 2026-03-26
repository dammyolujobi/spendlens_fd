import { Card, CardContent } from '@/components/ui/card'

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

  const debitCount = transactions.filter(t => t.type === 'debit').length
  const creditCount = transactions.filter(t => t.type === 'credit').length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10 animate-fade-in-up">
      {/* Total Spent - Wider on lg, normal on xl */}
      <Card className="md:col-span-1 lg:col-span-2 xl:col-span-2 bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 hover:bg-gradient-to-br hover:from-white/60 hover:to-white/40 dark:hover:from-white/15 dark:hover:to-white/10 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-spring group cursor-default">
        <CardContent className="p-8 sm:p-10 xl:p-12">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Spent</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                ₦{totalDebit.toLocaleString()}
              </div>
              <p className="text-sm xl:text-base text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{debitCount} transaction{debitCount !== 1 ? 's' : ''} this period</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Received - Smaller */}
      <Card className="lg:col-span-1 xl:col-span-2 bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 hover:bg-gradient-to-br hover:from-white/60 hover:to-white/40 dark:hover:from-white/15 dark:hover:to-white/10 shadow-lg hover:shadow-xl hover:shadow-green-500/10 dark:hover:shadow-green-500/5 transition-spring group cursor-default">
        <CardContent className="p-8 sm:p-10 xl:p-12">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Received</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                ₦{totalCredit.toLocaleString()}
              </div>
              <p className="text-sm xl:text-base text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{creditCount} transaction{creditCount !== 1 ? 's' : ''} this period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
