import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

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

export default function TransactionList({ transactions }: Props) {
  return (
    <Card className="bg-card border-border h-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction, idx) => {
              const isCredit = transaction.type === 'credit'
              return (
              <div key={idx} className="pb-2 border-b border-white/20 dark:border-white/5 last:border-b-0 last:pb-0 hover:bg-white/40 dark:hover:bg-white/5 -mx-2 px-2 py-1.5 rounded-lg transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                    isCredit ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'
                  }`}>
                    {isCredit ? (
                      <ArrowUpRight className={`w-4 h-4 ${
                        isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`} />
                    ) : (
                      <ArrowDownLeft className={`w-4 h-4 ${
                        isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{transaction.from}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{transaction.subject}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold ${
                      isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isCredit ? '+' : '-'}₦{transaction.amount}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(transaction.date)}</p>
                  </div>
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
            No transactions yet
          </div>
        )}
      </CardContent>
    </Card>
  )
}
