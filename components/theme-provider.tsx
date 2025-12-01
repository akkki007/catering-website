"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react"
import { doc, setDoc, onSnapshot, Unsubscribe } from "firebase/firestore"
import { db } from "@/lib/firebase"

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
  const [mounted, setMounted] = useState(false)
  const unsubscribeRef = useRef<Unsubscribe | null>(null)
  const isUpdatingFirebaseRef = useRef(false)

  // Helper function to apply theme to DOM
  const applyTheme = (themeToApply: Theme) => {
    if (typeof window === "undefined") return
    
    const root = window.document.documentElement
    
    // Remove all theme classes
    root.classList.remove("theme-blue", "theme-purple", "theme-green", "theme-orange")
    
    // Add current theme class
    root.classList.add(`theme-${themeToApply}`)
  }

  // Initialize theme and set up Firebase listener
  useEffect(() => {
    setMounted(true)
    
    if (typeof window === "undefined") return
    
    // Helper to apply theme from source (Firebase or localStorage)
    const applyThemeFromSource = (themeToApply: Theme, source: "firebase" | "localStorage") => {
      if (["blue", "purple", "green", "orange"].includes(themeToApply)) {
        applyTheme(themeToApply)
        setTheme(themeToApply)
        // Update localStorage for offline support
        if (source === "firebase") {
          localStorage.setItem(storageKey, themeToApply)
        }
      }
    }

    // Initialize with localStorage first (for instant loading)
    const storedLocal = localStorage.getItem(storageKey) as Theme | null
    if (storedLocal && ["blue", "purple", "green", "orange"].includes(storedLocal)) {
      applyTheme(storedLocal)
      setTheme(storedLocal)
    } else {
      applyTheme(defaultTheme)
      localStorage.setItem(storageKey, defaultTheme)
      setTheme(defaultTheme)
    }

    // Set up Firebase listener for real-time theme updates
    const themeDocRef = doc(db, "Settings", "theme")
    
    // Listen for real-time changes from Firebase
    unsubscribeRef.current = onSnapshot(
      themeDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const firebaseTheme = snapshot.data().currentTheme as Theme | undefined
          if (firebaseTheme && ["blue", "purple", "green", "orange"].includes(firebaseTheme)) {
            // Only update if we're not the one updating Firebase (to avoid loops)
            if (!isUpdatingFirebaseRef.current) {
              applyThemeFromSource(firebaseTheme, "firebase")
            }
          }
        } else {
          // Document doesn't exist, create it with current theme
          const currentTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme
          if (["blue", "purple", "green", "orange"].includes(currentTheme)) {
            setDoc(themeDocRef, { currentTheme }, { merge: true }).catch((error) => {
              console.error("Failed to initialize theme in Firebase:", error)
            })
          }
        }
      },
      (error) => {
        console.error("Error listening to theme changes:", error)
        // Fallback to localStorage on error
        const storedLocal = localStorage.getItem(storageKey) as Theme | null
        if (storedLocal && ["blue", "purple", "green", "orange"].includes(storedLocal)) {
          applyThemeFromSource(storedLocal, "localStorage")
        }
      }
    )

    // Cleanup listener on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [storageKey, defaultTheme])

  // Update theme when it changes (only after initial mount)
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return
    
    // Apply theme immediately
    applyTheme(theme)
    
    // Store theme preference
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey, mounted])

  // Listen for storage changes (sync across tabs/windows)
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const newTheme = e.newValue as Theme
        if (["blue", "purple", "green", "orange"].includes(newTheme)) {
          applyTheme(newTheme)
          setTheme(newTheme)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [storageKey])

  // Enhanced setTheme that applies immediately and updates Firebase
  const handleSetTheme = useCallback(async (newTheme: Theme) => {
    if (typeof window === "undefined") return
    
    // Validate theme
    if (!["blue", "purple", "green", "orange"].includes(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}`)
      return
    }
    
    // Apply theme immediately to DOM - this ensures instant visual feedback
    // This happens synchronously before any React re-renders
    applyTheme(newTheme)
    
    // Store in localStorage immediately (for offline support)
    localStorage.setItem(storageKey, newTheme)
    
    // Update state - this will trigger useEffect for consistency
    setTheme(newTheme)
    
    // Update Firebase (don't await to avoid blocking UI)
    try {
      isUpdatingFirebaseRef.current = true
      const themeDocRef = doc(db, "Settings", "theme")
      await setDoc(themeDocRef, { currentTheme: newTheme }, { merge: true })
      
      // Reset flag after a short delay to allow Firebase listener to process
      setTimeout(() => {
        isUpdatingFirebaseRef.current = false
      }, 100)
    } catch (error) {
      console.error("Failed to update theme in Firebase:", error)
      isUpdatingFirebaseRef.current = false
      // Continue even if Firebase update fails (localStorage is updated)
    }
  }, [storageKey])

  const value = useMemo(() => ({
    theme,
    setTheme: handleSetTheme,
  }), [theme, handleSetTheme])

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
