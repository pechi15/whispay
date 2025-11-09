"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinanceStore } from "@/lib/store"
import { BankConnectModal } from "@/components/modals/bank-connect-modal"
import { toast } from "sonner"

export function SignUpForm() {
  const router = useRouter()
  const { setUser, updateUser } = useFinanceStore()
  const [showBankModal, setShowBankModal] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    location: "",
    email: "",
    employment: "",
    consent1: false,
    consent2: false,
    consent3: false,
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.age || Number.parseInt(formData.age) < 16 || Number.parseInt(formData.age) > 100) {
      newErrors.age = "Age must be between 16 and 100"
    }
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required"
    if (!formData.consent1) newErrors.consent1 = "Transaction consent required"
    if (!formData.consent2) newErrors.consent2 = "Monitoring consent required"
    if (!formData.consent3) newErrors.consent3 = "Terms consent required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      setUser({
        fullName: formData.fullName,
        age: Number.parseInt(formData.age),
        location: formData.location,
        email: formData.email,
        employment: (formData.employment as any) || "Other",
        bankConnected: false,
      })
      setShowBankModal(true)
    }
  }

  const handleSkip = () => {
    if (validateForm()) {
      setUser({
        fullName: formData.fullName,
        age: Number.parseInt(formData.age),
        location: formData.location,
        email: formData.email,
        employment: (formData.employment as any) || "Other",
        bankConnected: false,
      })
      toast.success("Profile created! Continue to goals.")
      router.push("/goals")
    }
  }

  const handleBankConnected = () => {
    setShowBankModal(false)
    toast.success("Bank connected via Open Banking (demo).")
    router.push("/goals")
  }

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (formData.fullName || formData.age || formData.location || formData.email) {
      e.preventDefault()
      e.returnValue = ""
    }
  }

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [formData])

  return (
    <>
      <Card className="p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-2">Sign up for Whispay</h2>
        <p className="text-muted-foreground mb-6">Connect your bank and get your personal finance plan</p>

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-foreground mb-2 block">
              Full name
            </label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value })
                if (errors.fullName) setErrors({ ...errors, fullName: "" })
              }}
              className={errors.fullName ? "border-destructive" : ""}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-sm text-destructive mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="text-sm font-medium text-foreground mb-2 block">
              Age
            </label>
            <Input
              id="age"
              type="number"
              placeholder="18"
              value={formData.age}
              onChange={(e) => {
                setFormData({ ...formData, age: e.target.value })
                if (errors.age) setErrors({ ...errors, age: "" })
              }}
              className={errors.age ? "border-destructive" : ""}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? "age-error" : undefined}
            />
            {errors.age && (
              <p id="age-error" className="text-sm text-destructive mt-1">
                {errors.age}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="text-sm font-medium text-foreground mb-2 block">
              Postcode / City
            </label>
            <Input
              id="location"
              placeholder="e.g., SW1A 1AA"
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value })
                if (errors.location) setErrors({ ...errors, location: "" })
              }}
              className={errors.location ? "border-destructive" : ""}
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location && (
              <p id="location-error" className="text-sm text-destructive mt-1">
                {errors.location}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
              className={errors.email ? "border-destructive" : ""}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Employment */}
          <div>
            <label htmlFor="employment" className="text-sm font-medium text-foreground mb-2 block">
              Employment status (optional)
            </label>
            <Select
              value={formData.employment}
              onValueChange={(value) => setFormData({ ...formData, employment: value })}
            >
              <SelectTrigger id="employment">
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Employed">Employed</SelectItem>
                <SelectItem value="Self-employed">Self-employed</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-sm font-semibold text-foreground">Consent & Agreement</p>

            <div className="flex items-start gap-3">
              <Checkbox
                id="consent1"
                checked={formData.consent1}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, consent1: checked as boolean })
                  if (checked) setErrors({ ...errors, consent1: "" })
                }}
                className="mt-1"
                aria-invalid={!!errors.consent1}
                aria-describedby={errors.consent1 ? "consent1-error" : undefined}
              />
              <label htmlFor="consent1" className="text-sm text-foreground leading-relaxed cursor-pointer">
                I agree to connect my bank or wallet to read past 12 months of transactions.
              </label>
            </div>
            {errors.consent1 && (
              <p id="consent1-error" className="text-sm text-destructive">
                {errors.consent1}
              </p>
            )}

            <div className="flex items-start gap-3">
              <Checkbox
                id="consent2"
                checked={formData.consent2}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, consent2: checked as boolean })
                  if (checked) setErrors({ ...errors, consent2: "" })
                }}
                className="mt-1"
                aria-invalid={!!errors.consent2}
                aria-describedby={errors.consent2 ? "consent2-error" : undefined}
              />
              <label htmlFor="consent2" className="text-sm text-foreground leading-relaxed cursor-pointer">
                I consent to ongoing access for transaction monitoring to power spending nudges.
              </label>
            </div>
            {errors.consent2 && (
              <p id="consent2-error" className="text-sm text-destructive">
                {errors.consent2}
              </p>
            )}

            <div className="flex items-start gap-3">
              <Checkbox
                id="consent3"
                checked={formData.consent3}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, consent3: checked as boolean })
                  if (checked) setErrors({ ...errors, consent3: "" })
                }}
                className="mt-1"
                aria-invalid={!!errors.consent3}
                aria-describedby={errors.consent3 ? "consent3-error" : undefined}
              />
              <label htmlFor="consent3" className="text-sm text-foreground leading-relaxed cursor-pointer">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            {errors.consent3 && (
              <p id="consent3-error" className="text-sm text-destructive">
                {errors.consent3}
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              onClick={handleContinue}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              size="lg"
            >
              Continue & connect bank
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
              size="lg"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </Card>

      {/* Bank Connect Modal */}
      <BankConnectModal open={showBankModal} onOpenChange={setShowBankModal} onConnected={handleBankConnected} />
    </>
  )
}
