'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

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

export default function SpendingChart({ transactions }: Props) {
  // Group by vendor and sum amounts
  const vendorData = transactions.reduce(
    (acc, t) => {
      const vendor = t.from
      const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ''))
      const existing = acc.find(item => item.vendor === vendor)

      if (existing) {
        existing.amount += isNaN(amount) ? 0 : amount
      } else {
        acc.push({
          vendor: vendor,
          amount: isNaN(amount) ? 0 : amount
        })
      }
      return acc
    },
    [] as Array<{ vendor: string; amount: number }>
  )

  // Sort and take top 8
  const chartData = vendorData
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)
    .map(item => ({
      name: item.vendor.substring(0, 12),
      value: parseFloat(item.amount.toFixed(2))
    }))

  return (
    <Card className="bg-card border-border transition-smooth">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Spending by Vendor</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="w-full animate-fade-in-up">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            No transaction data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
