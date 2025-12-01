"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Palette, Check } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const themes = [
  {
    name: "Default Blue",
    value: "blue",
    primary: "hsl(221.2 83.2% 53.3%)",
    secondary: "hsl(210 40% 96%)",
    description: "Clean and professional blue theme",
  },
  {
    name: "Purple Passion",
    value: "purple",
    primary: "hsl(262.1 83.3% 57.8%)",
    secondary: "hsl(270 20% 96%)",
    description: "Creative and vibrant purple theme",
  },
  {
    name: "Emerald Green",
    value: "green",
    primary: "hsl(142.1 76.2% 36.3%)",
    secondary: "hsl(138 76% 97%)",
    description: "Fresh and natural green theme",
  },
  {
    name: "Sunset Orange",
    value: "orange",
    primary: "hsl(24.6 95% 53.1%)",
    secondary: "hsl(24 100% 97%)",
    description: "Warm and energetic orange theme",
  },
]

export function ThemeSelector() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (newTheme: string) => {
    // Ensure the theme is valid and properly typed
    if (["blue", "purple", "green", "orange"].includes(newTheme)) {
      setTheme(newTheme as "blue" | "purple" | "green" | "orange")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Your Theme</DialogTitle>
          <DialogDescription>Select a color combination that matches your style</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {themes.map((themeOption) => (
            <div
              key={themeOption.value}
              className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:bg-accent ${
                theme === themeOption.value ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleThemeChange(themeOption.value)}
            >
              <div className="flex-shrink-0 flex space-x-1">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: themeOption.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: themeOption.secondary }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{themeOption.name}</p>
                <p className="text-xs text-muted-foreground">{themeOption.description}</p>
              </div>
              {theme === themeOption.value && (
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
