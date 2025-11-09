import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  fullName: string
  age: number
  location: string
  email: string
  employment: "Student" | "Employed" | "Self-employed" | "Other"
  bankConnected: boolean
  bankProvider?: "TrueLayer" | "Monzo" | "Revolut"
}

export interface IncomeSource {
  id: string
  source: "Job" | "Stipend" | "Benefits" | "Side-gig"
  amount: number
  frequency: "Weekly" | "Monthly" | "Ad-hoc"
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  targetDate: string
  type: "short-term" | "medium-term"
  priority?: "low" | "med" | "high"
  riskComfort?: "Very low" | "Low" | "Balanced"
  contributionPreference?: "Weekly" | "Monthly"
}

export interface FinanceStore {
  user: User | null
  incomeSources: IncomeSource[]
  goals: Goal[]
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  setBankConnected: (provider: string) => void
  addIncomeSource: (source: IncomeSource) => void
  removeIncomeSource: (id: string) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  removeGoal: (id: string) => void
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      user: null,
      incomeSources: [],
      goals: [],
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      setBankConnected: (provider) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                bankConnected: true,
                bankProvider: provider as any,
              }
            : null,
        })),
      addIncomeSource: (source) =>
        set((state) => ({
          incomeSources: [...state.incomeSources, source],
        })),
      removeIncomeSource: (id) =>
        set((state) => ({
          incomeSources: state.incomeSources.filter((s) => s.id !== id),
        })),
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, goal],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),
      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
    }),
    {
      name: "whispay-store",
    },
  ),
)
