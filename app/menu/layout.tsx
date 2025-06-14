import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "../globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Restaurant Menu",
  description: "Traditional Indian Cuisine Menu",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="blue" storageKey="restaurant-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
