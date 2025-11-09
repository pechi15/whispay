"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface ActionableItemsProps {
  items: Array<{
    id: string
    title: string
    description: string
    category: string
    priority: "high" | "medium" | "low"
    link?: string
  }>
}

export function ActionableItems({ items }: ActionableItemsProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const toggleCompleted = (id: string) => {
    const newCompleted = new Set(completed)
    if (newCompleted.has(id)) {
      newCompleted.delete(id)
    } else {
      newCompleted.add(id)
    }
    setCompleted(newCompleted)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="p-6 border border-border">
      <h3 className="font-semibold text-lg mb-6 text-foreground">Actionable items</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex gap-4 p-4 rounded-lg border border-border transition-colors ${
              completed.has(item.id) ? "bg-muted/30" : "bg-card"
            }`}
          >
            <Checkbox
              checked={completed.has(item.id)}
              onCheckedChange={() => toggleCompleted(item.id)}
              className="mt-1 flex-shrink-0"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-foreground text-balance">{item.title}</h4>
                <Badge className={getPriorityColor(item.priority)} variant="default">
                  {item.priority}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{item.description}</p>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Learn more
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
