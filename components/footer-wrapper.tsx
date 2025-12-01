"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"

export function FooterWrapper() {
  const pathname = usePathname()
  
  // Hide footer on admin and login pages
  const hideFooter = pathname?.startsWith("/admin") || pathname?.startsWith("/login")
  
  if (hideFooter) {
    return null
  }
  
  return <Footer />
}

