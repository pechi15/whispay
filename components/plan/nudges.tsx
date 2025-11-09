"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface NudgesProps {
  nudges: Array<{
    id: string
    title: string
    description: string
    enabled: boolean
  }>
}

export function Nudges({ nudges: initialNudges }: NudgesProps) {
  const [nudges, setNudges] = useState(initialNudges)

  const toggleNudge = (id: string) => {
    setNudges(nudges.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)))
  }

  return (
    <Card className="p-6 border border-border">
      <h3 className="font-semibold text-lg mb-6 text-foreground">Spending nudges</h3>

      <div className="space-y-4">
        {nudges.map((nudge) => (
          <div key={nudge.id} className="flex items-start justify-between gap-4 p-4 bg-muted/20 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">{nudge.title}</h4>
              <p className="text-sm text-muted-foreground">{nudge.description}</p>
            </div>
            <Switch
              checked={nudge.enabled}
              onCheckedChange={() => toggleNudge(nudge.id)}
              aria-label={`Toggle ${nudge.title}`}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
