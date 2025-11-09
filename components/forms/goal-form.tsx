"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Goal } from "@/lib/store"

const generateId = () => Math.random().toString(36).substring(2, 11)

interface GoalFormProps {
  type: "short-term" | "medium-term"
  onGoalAdded: (goal: Goal) => void
}

export function GoalForm({ type, onGoalAdded }: GoalFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    priority: type === "short-term" ? "med" : undefined,
    riskComfort: type === "medium-term" ? "Balanced" : undefined,
    contributionPreference: type === "medium-term" ? "Monthly" : undefined,
  })

  const [smart, setSmart] = useState({
    specific: false,
    measurable: false,
    achievable: false,
    relevant: false,
    timeBound: false,
  })

  const handleAddGoal = () => {
    if (!formData.name || !formData.targetAmount || !formData.targetDate) return

    const goal: Goal = {
      id: generateId(),
      name: formData.name,
      targetAmount: Number.parseFloat(formData.targetAmount),
      targetDate: formData.targetDate,
      type,
      ...(type === "short-term" && { priority: formData.priority as any }),
      ...(type === "medium-term" && {
        riskComfort: formData.riskComfort as any,
        contributionPreference: formData.contributionPreference as any,
      }),
    }

    onGoalAdded(goal)

    // Reset form
    setFormData({
      name: "",
      targetAmount: "",
      targetDate: "",
      priority: type === "short-term" ? "med" : undefined,
      riskComfort: type === "medium-term" ? "Balanced" : undefined,
      contributionPreference: type === "medium-term" ? "Monthly" : undefined,
    })
    setSmart({ specific: false, measurable: false, achievable: false, relevant: false, timeBound: false })
  }

  return (
    <Card className="p-6 border border-border">
      <h3 className="font-semibold text-lg mb-4 text-foreground">
        {type === "short-term" ? "Short-term goal" : "Medium-term goal"}
      </h3>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Goal name</label>
          <Input
            placeholder={type === "short-term" ? "3-day trip to Edinburgh" : "£3,000 Emergency Fund"}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              setSmart({
                ...smart,
                specific: e.target.value.length > 5,
                measurable: smart.measurable,
              })
            }}
          />
        </div>

        {/* Target Amount */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Target amount (£)</label>
          <Input
            type="number"
            placeholder="1000"
            value={formData.targetAmount}
            onChange={(e) => {
              setFormData({ ...formData, targetAmount: e.target.value })
              setSmart({
                ...smart,
                measurable: e.target.value.length > 0,
                achievable: Number.parseFloat(e.target.value) > 0,
              })
            }}
          />
        </div>

        {/* Target Date */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Target date</label>
          <Input
            type="date"
            value={formData.targetDate}
            onChange={(e) => {
              setFormData({ ...formData, targetDate: e.target.value })
              setSmart({ ...smart, timeBound: e.target.value.length > 0 })
            }}
          />
        </div>

        {/* Type-specific fields */}
        {type === "short-term" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="med">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {type === "medium-term" && (
          <>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Risk comfort</label>
              <Select
                value={formData.riskComfort}
                onValueChange={(value) => setFormData({ ...formData, riskComfort: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very low">Very low</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Contribution preference</label>
              <Select
                value={formData.contributionPreference}
                onValueChange={(value) => setFormData({ ...formData, contributionPreference: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* SMART Checklist */}
        {type === "short-term" && (
          <div className="bg-muted/30 p-3 rounded-md space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">SMART helper</p>
            {Object.entries(smart).map(([key, checked]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox checked={checked} disabled className="opacity-50" />
                <span className="text-xs text-muted-foreground capitalize">{key}</span>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleAddGoal}
          disabled={!formData.name || !formData.targetAmount || !formData.targetDate}
          className="w-full"
        >
          Add goal
        </Button>
      </div>
    </Card>
  )
}
