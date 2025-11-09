"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFinanceStore } from "@/lib/store"
import { generateBudgetPlan } from "@/lib/mock-ai-plan"
import { GoalForm } from "@/components/forms/goal-form"
import { IncomeTable } from "@/components/forms/income-table"
import { BudgetSummary } from "@/components/plan/budget-summary"
import { ActionableItems } from "@/components/plan/actionable-items"
import { Nudges } from "@/components/plan/nudges"
import { SavingsSchedule } from "@/components/plan/savings-schedule"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function GoalsPage() {
  const router = useRouter()
  const user = useFinanceStore((state) => state.user)
  const incomeSources = useFinanceStore((state) => state.incomeSources)
  const goals = useFinanceStore((state) => state.goals)
  const { addIncomeSource, removeIncomeSource, addGoal } = useFinanceStore()

  const [activeTab, setActiveTab] = useState("goals")
  const [plan, setPlan] = useState<ReturnType<typeof generateBudgetPlan> | null>(null)
  const [planGenerating, setPlanGenerating] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges && activeTab === "goals") {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasChanges, activeTab])

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const handleGeneratePlan = async () => {
    setPlanGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const newPlan = generateBudgetPlan(incomeSources, goals)
    setPlan(newPlan)
    setActiveTab("plan")
    setPlanGenerating(false)
    toast.success("Plan generated successfully!")
    setHasChanges(false)
  }

  const handleExportPlan = () => {
    if (plan) {
      const dataStr = JSON.stringify(plan, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `whispay-plan-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      toast.success("Plan exported as JSON")
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Set your goals · Get your plan</h1>
          <p className="text-muted-foreground">
            Connected to {user.bankProvider ? `${user.bankProvider} (demo)` : "no bank yet"}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="plan" disabled={!plan}>
              Plan{" "}
              {plan && (
                <Badge className="ml-2" variant="default">
                  Generated
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <GoalForm
              type="short-term"
              onGoalAdded={(goal) => {
                addGoal(goal)
                setHasChanges(true)
                toast.success(`Goal "${goal.name}" added`)
              }}
            />
            <GoalForm
              type="medium-term"
              onGoalAdded={(goal) => {
                addGoal(goal)
                setHasChanges(true)
                toast.success(`Goal "${goal.name}" added`)
              }}
            />
            <IncomeTable
              sources={incomeSources}
              onSourceAdded={(source) => {
                addIncomeSource(source)
                setHasChanges(true)
                toast.success(`Income source added: ${source.amount}`)
              }}
              onSourceRemoved={(id) => {
                removeIncomeSource(id)
                setHasChanges(true)
                toast.info("Income source removed")
              }}
            />

            {/* Spending Import Status */}
            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Spending data</h3>
              {user.bankConnected ? (
                <div className="space-y-2">
                  <p className="text-sm text-foreground">✓ Transactions imported (demo)</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Housing",
                      "Bills",
                      "Groceries",
                      "Transport",
                      "Eating Out",
                      "Entertainment",
                      "Travel",
                      "Shopping",
                      "Misc",
                    ].map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Upload CSV/PDF to import spending data (not available in MVP)
                </p>
              )}
            </Card>

            {/* Generate Plan CTA */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleGeneratePlan}
                disabled={goals.length === 0 || incomeSources.length === 0 || planGenerating}
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
                aria-busy={planGenerating}
              >
                {planGenerating ? "Generating plan..." : "Generate plan"}
              </Button>
            </div>
          </TabsContent>

          {/* Plan Tab */}
          <TabsContent value="plan" className="space-y-6">
            {/* Compliance Banner */}
            <Alert className="border-muted bg-muted/30" role="alert">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Educational only. Not financial advice. Open Banking connections are read-only.
              </AlertDescription>
            </Alert>

            {plan && (
              <>
                <BudgetSummary
                  monthlyIncome={plan.monthlyIncome}
                  fixedCosts={plan.fixedCosts}
                  discretionary={plan.discretionary}
                  savingsTarget={plan.savingsTarget}
                  categories={plan.categories}
                />

                <ActionableItems items={plan.actionableItems} />

                <Nudges nudges={plan.nudges} />

                <SavingsSchedule schedule={plan.savingsSchedule} />

                {/* Plan Actions */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleGeneratePlan} variant="outline" className="flex-1 bg-transparent" size="lg">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-generate with stricter budget
                  </Button>
                  <Button onClick={handleExportPlan} variant="outline" className="flex-1 bg-transparent" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Export plan (JSON)
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
