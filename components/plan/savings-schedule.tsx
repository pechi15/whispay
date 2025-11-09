"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatGBP } from "@/lib/currency"

interface SavingsScheduleProps {
  schedule: Array<{
    date: string
    goalId: string
    goalName: string
    amount: number
  }>
}

export function SavingsSchedule({ schedule }: SavingsScheduleProps) {
  return (
    <Card className="p-6 border border-border">
      <h3 className="font-semibold text-lg mb-4 text-foreground">Savings schedule</h3>

      {schedule.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.slice(0, 12).map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-foreground">{new Date(entry.date).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell className="text-foreground">{entry.goalName}</TableCell>
                  <TableCell className="text-right font-medium text-accent">{formatGBP(entry.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">Add goals to generate a savings schedule</p>
      )}
    </Card>
  )
}
