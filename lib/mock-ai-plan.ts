import type { Goal, IncomeSource } from "./store"

export interface BudgetPlan {
  monthlyIncome: number
  fixedCosts: number
  discretionary: number
  savingsTarget: number
  categories: {
    name: string
    budget: number
    spent: number
    remaining: number
  }[]
  actionableItems: {
    id: string
    title: string
    description: string
    category: string
    priority: "high" | "medium" | "low"
    link?: string
  }[]
  nudges: {
    id: string
    title: string
    description: string
    enabled: boolean
  }[]
  savingsSchedule: {
    date: string
    goalId: string
    goalName: string
    amount: number
  }[]
}

export function generateBudgetPlan(incomeSources: IncomeSource[], goals: Goal[]): BudgetPlan {
  // Calculate monthly income
  const monthlyIncome = incomeSources.reduce((acc, source) => {
    const monthlyAmount =
      source.frequency === "Monthly"
        ? source.amount
        : source.frequency === "Weekly"
          ? source.amount * 4.33
          : source.amount
    return acc + monthlyAmount
  }, 0)

  // Apply 50/30/20 rule
  const fixedCosts = monthlyIncome * 0.5 // 50% needs
  const discretionary = monthlyIncome * 0.3 // 30% wants
  const savingsTarget = monthlyIncome * 0.2 // 20% savings

  // Budget categories
  const categories = [
    { name: "Housing", budget: fixedCosts * 0.6, spent: fixedCosts * 0.55, remaining: fixedCosts * 0.05 },
    { name: "Bills", budget: fixedCosts * 0.25, spent: fixedCosts * 0.24, remaining: fixedCosts * 0.01 },
    { name: "Groceries", budget: fixedCosts * 0.15, spent: fixedCosts * 0.14, remaining: fixedCosts * 0.01 },
    { name: "Transport", budget: discretionary * 0.3, spent: discretionary * 0.28, remaining: discretionary * 0.02 },
    { name: "Eating Out", budget: discretionary * 0.3, spent: discretionary * 0.25, remaining: discretionary * 0.05 },
    {
      name: "Entertainment",
      budget: discretionary * 0.2,
      spent: discretionary * 0.18,
      remaining: discretionary * 0.02,
    },
    { name: "Shopping", budget: discretionary * 0.2, spent: discretionary * 0.19, remaining: discretionary * 0.01 },
  ]

  // Actionable items (UK-specific)
  const actionableItems = [
    {
      id: "1",
      title: "Set up auto-transfer to savings pot",
      description: `Set £${Math.round(savingsTarget / 4)}/week auto-transfer to goal savings at Monzo.`,
      category: "Savings",
      priority: "high" as const,
    },
    {
      id: "2",
      title: "Cap Eating Out spending",
      description: `Set weekly limit of £${Math.round((discretionary * 0.3) / 4)}. Enable nudge on card authorisation.`,
      category: "Spending",
      priority: "medium" as const,
      link: "https://www.example.com",
    },
    {
      id: "3",
      title: "16-25 Railcard discount",
      description: "Save ~33% on train tickets if age eligible.",
      category: "Transport",
      priority: "medium" as const,
      link: "https://www.16-25railcard.co.uk",
    },
    {
      id: "4",
      title: "Switch energy provider",
      description: "Save £15-25/month with Octopus Energy quote.",
      category: "Bills",
      priority: "high" as const,
      link: "https://www.octopusenergy.com",
    },
    {
      id: "5",
      title: "Open Lifetime ISA",
      description: "If age 18–39: Get 25% bonus, cap £4k/yr. Tax-free growth for first home or retirement.",
      category: "Investment",
      priority: "medium" as const,
      link: "https://www.isaquestions.fca.org.uk",
    },
  ]

  // Nudges
  const nudges = [
    {
      id: "nudge-1",
      title: "Pre-spend alert: Eating Out",
      description: "If weekly spend > £50, prompt at checkout",
      enabled: true,
    },
    {
      id: "nudge-2",
      title: "Travel booking alert",
      description: "If booking > £100 and holiday goal exists, suggest cheaper dates",
      enabled: true,
    },
    {
      id: "nudge-3",
      title: "Round-up savings",
      description: "Round all purchases to nearest £1, save difference to first goal",
      enabled: false,
    },
  ]

  // Generate savings schedule
  const savingsSchedule: BudgetPlan["savingsSchedule"] = []
  goals.forEach((goal) => {
    const targetDate = new Date(goal.targetDate)
    const today = new Date()
    const daysUntil = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const weeksUntil = Math.ceil(daysUntil / 7)
    const weeklyAmount = goal.targetAmount / weeksUntil

    for (let i = 0; i < Math.min(weeksUntil, 12); i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i * 7)
      savingsSchedule.push({
        date: date.toISOString().split("T")[0],
        goalId: goal.id,
        goalName: goal.name,
        amount: weeklyAmount,
      })
    }
  })

  return {
    monthlyIncome,
    fixedCosts,
    discretionary,
    savingsTarget,
    categories,
    actionableItems,
    nudges,
    savingsSchedule,
  }
}
