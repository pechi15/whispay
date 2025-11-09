"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatGBP } from "@/lib/currency"

interface BudgetSummaryProps {
  monthlyIncome: number
  fixedCosts: number
  discretionary: number
  savingsTarget: number
  categories: Array<{
    name: string
    budget: number
    spent: number
    remaining: number
  }>
}

export function BudgetSummary({
  monthlyIncome,
  fixedCosts,
  discretionary,
  savingsTarget,
  categories,
}: BudgetSummaryProps) {
  return (
    <Card className="p-6 border border-border">
      <h3 className="font-semibold text-lg mb-6 text-foreground">Budget summary</h3>

      {/* Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-8 pb-8 border-b border-border">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Monthly income</p>
          <p className="text-2xl font-bold text-primary">{formatGBP(monthlyIncome)}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Fixed costs (50%)</p>
          <p className="text-2xl font-bold text-foreground">{formatGBP(fixedCosts)}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Savings target (20%)</p>
          <p className="text-2xl font-bold text-accent">{formatGBP(savingsTarget)}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        <p className="font-semibold text-foreground">Spending by category</p>
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{cat.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatGBP(cat.spent)} / {formatGBP(cat.budget)}
              </span>
            </div>
            <Progress value={(cat.spent / cat.budget) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{formatGBP(cat.remaining)} remaining</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
