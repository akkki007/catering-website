"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "blue" | "purple" | "green" | "orange"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "blue",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "blue",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    const stored = localStorage.getItem(storageKey) as Theme

    if (stored) {
      setTheme(stored)
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove("theme-blue", "theme-purple", "theme-green", "theme-orange")

    // Add current theme class
    root.classList.add(`theme-${theme}`)

    // Store theme preference
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
