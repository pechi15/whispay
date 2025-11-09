import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Lock } from "lucide-react"

const features = [
  {
    category: "Everyday Money",
    tier: "Free",
    isPremium: false,
    items: [
      { name: "Expense Tracking", available: true },
      { name: "Day-to-day Budget", available: true },
      { name: "Spending Habit Insights", available: true },
      { name: "Simple Financial Tips", available: true },
    ],
  },
  {
    category: "Plan and Goal",
    tier: "Free",
    isPremium: false,
    items: [
      { name: "Saving Goals", available: true },
      { name: "Financial Forecast", available: true },
      { name: "Personal Project Recommendations", available: true },
      { name: "Goal Progress Tracking", available: true },
    ],
  },
  {
    category: "Business and Project",
    tier: "Premium",
    isPremium: true,
    items: [
      { name: "Cash-flow Guidance", available: false },
      { name: "Accounting Templates", available: false },
      { name: "Small Business Tailored Advice", available: false },
      { name: "Project Budget Tools", available: false },
    ],
  },
  {
    category: "Tax and Compliance",
    tier: "Premium",
    isPremium: true,
    items: [
      { name: "Region-specific Tax Guidance", available: false },
      { name: "Simple Contact Points", available: false },
      { name: "Human Consultants", available: false },
      { name: "Compliance Alerts", available: false },
    ],
  },
]

export function FeatureMatrix() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Features Built for Your Financial Journey
          </h2>
          <p className="text-muted-foreground text-lg">Start free, unlock premium tools when you're ready</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className={`p-6 flex flex-col ${
                feature.isPremium
                  ? "bg-gradient-to-br from-muted/40 to-muted/20 border-border/50 opacity-75"
                  : "bg-card hover:border-primary/50"
              }`}
            >
              <div className="mb-6 flex items-start justify-between">
                <h3 className="font-bold text-lg text-foreground">{feature.category}</h3>
                {feature.isPremium ? (
                  <Badge variant="secondary" className="ml-2">
                    <Lock className="w-3 h-3 mr-1" />
                    Coming Soon
                  </Badge>
                ) : (
                  <Badge className="ml-2 bg-emerald-600 text-white hover:bg-emerald-700">Free</Badge>
                )}
              </div>

              <div className="space-y-3 flex-1">
                {feature.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-3">
                    <div
                      className={`mt-1 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                        item.available ? "bg-emerald-600 border-emerald-600" : "bg-muted border-border"
                      }`}
                    >
                      {item.available && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${item.available ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {feature.isPremium && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">Premium features launching Q1 2025</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-accent/10 border border-accent/20 rounded-xl p-6 text-center">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Early access?</span> Join our waitlist for Premium features
            and get exclusive founder pricing.
          </p>
        </div>
      </div>
    </section>
  )
}
