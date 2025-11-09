"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useFinanceStore } from "@/lib/store"
import { CheckCircle, Loader2 } from "lucide-react"

const MOCK_PROVIDERS = [
  { id: "truelayer", name: "TrueLayer", description: "Sandbox", icon: "🏦" },
  { id: "monzo", name: "Monzo", description: "Mock", icon: "💳" },
  { id: "revolut", name: "Revolut", description: "Mock", icon: "💰" },
]

interface BankConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnected: () => void
}

export function BankConnectModal({ open, onOpenChange, onConnected }: BankConnectModalProps) {
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const { setBankConnected } = useFinanceStore()

  const handleSelectProvider = async (providerId: string) => {
    setConnecting(true)
    setSelectedProvider(providerId)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const providerName = MOCK_PROVIDERS.find((p) => p.id === providerId)?.name || "Unknown"
    setBankConnected(providerName)
    setConnecting(false)
    setConnected(true)

    // Auto-close after success
    setTimeout(() => {
      onConnected()
      setConnected(false)
      setSelectedProvider(null)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your bank</DialogTitle>
          <DialogDescription>Select your bank to securely connect your account (demo mode)</DialogDescription>
        </DialogHeader>

        {!connected ? (
          <div className="grid gap-3 py-4">
            {MOCK_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSelectProvider(provider.id)}
                disabled={connecting}
                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <span className="text-2xl">{provider.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
                {connecting && selectedProvider === provider.id && (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center gap-4">
            <CheckCircle className="w-12 h-12 text-accent" />
            <p className="text-center font-semibold text-foreground">Bank connected successfully!</p>
            <p className="text-sm text-center text-muted-foreground">Your transactions are being imported...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
