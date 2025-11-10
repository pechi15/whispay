"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SignUpForm } from "@/components/forms/sign-up-form"
import { FeatureMatrix } from "@/components/features/feature-matrix"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFinanceStore } from "@/lib/store"
import { TrendingUp, Zap, Bell } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const user = useFinanceStore((state) => state.user)
  const resetUser = useFinanceStore((state) => state.resetUser)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (isHydrated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full shadow-lg text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Welcome back, {user.fullName}!</h2>
          <p className="text-muted-foreground mb-6">
            You're already set up. Continue to your dashboard or start fresh.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/goals")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              size="lg"
            >
              Continue to goals
            </Button>
            <Button
              onClick={() => {
                resetUser()
                setIsHydrated(false)
              }}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Start over
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Hero Card */}
            <div className="flex flex-col justify-center">
              <Card className="p-8 bg-card/50 backdrop-blur border-border/50 shadow-xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight text-balance">
                  A UK money mentor that nudges you to your goals
                </h1>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" aria-hidden="true" />
                    <p className="text-foreground">Connect your bank via Open Banking (read-only)</p>
                  </div>
                  <div className="flex gap-4">
                    <TrendingUp className="w-6 h-6 text-accent flex-shrink-0 mt-1" aria-hidden="true" />
                    <p className="text-foreground">Budget suggestions tailored to your habits</p>
                  </div>
                  <div className="flex gap-4">
                    <Bell className="w-6 h-6 text-accent flex-shrink-0 mt-1" aria-hidden="true" />
                    <p className="text-foreground">Real-time nudges before unaligned spends</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground">📊 Illustration placeholder</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Form Card */}
            <div className="flex flex-col justify-center">
              <SignUpForm />
            </div>
          </div>
        </div>
      </div>

      <FeatureMatrix />
    </div>
  )
}
