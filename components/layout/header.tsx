"use client"

import Link from "next/link"
import { Moon, Sun, HelpCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("theme") || "light"
    setTheme(saved as "light" | "dark")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-primary/30">
            <span className="text-primary font-bold text-sm">W</span>
          </div>
          Whispay
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Help
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Help">
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
