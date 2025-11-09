"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { IncomeSource } from "@/lib/store"
import { Trash2, Plus } from "lucide-react"

const generateId = () => Math.random().toString(36).substring(2, 11)

interface IncomeTableProps {
  sources: IncomeSource[]
  onSourceAdded: (source: IncomeSource) => void
  onSourceRemoved: (id: string) => void
}

export function IncomeTable({ sources, onSourceAdded, onSourceRemoved }: IncomeTableProps) {
  const [newSource, setNewSource] = useState({
    source: "Job" as const,
    amount: "",
    frequency: "Monthly" as const,
  })

  const handleAddSource = () => {
    if (!newSource.amount) return

    const source: IncomeSource = {
      id: generateId(),
      source: newSource.source,
      amount: Number.parseFloat(newSource.amount),
      frequency: newSource.frequency,
    }

    onSourceAdded(source)
    setNewSource({ source: "Job", amount: "", frequency: "Monthly" })
  }

  return (
    <Card className="p-6 border border-border">
      <h3 className="font-semibold text-lg mb-4 text-foreground">Income sources</h3>

      {sources.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Amount (£)</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="text-foreground">{source.source}</TableCell>
                  <TableCell className="text-foreground">£{source.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground">{source.frequency}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => onSourceRemoved(source.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label="Remove income source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
        <p className="text-sm font-medium text-foreground">Add income source</p>

        <div className="grid sm:grid-cols-3 gap-3">
          <Select
            value={newSource.source}
            onValueChange={(value) => setNewSource({ ...newSource, source: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Job">Job</SelectItem>
              <SelectItem value="Stipend">Stipend</SelectItem>
              <SelectItem value="Benefits">Benefits</SelectItem>
              <SelectItem value="Side-gig">Side-gig</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Amount (£)"
            value={newSource.amount}
            onChange={(e) => setNewSource({ ...newSource, amount: e.target.value })}
          />

          <Select
            value={newSource.frequency}
            onValueChange={(value) => setNewSource({ ...newSource, frequency: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Ad-hoc">Ad-hoc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAddSource}
          variant="outline"
          className="w-full bg-transparent"
          disabled={!newSource.amount}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add source
        </Button>
      </div>
    </Card>
  )
}
