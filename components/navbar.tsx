"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"
import Image from "next/image"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { app } from "@/lib/firebase"

const firestore = getFirestore(app)

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [navData, setNavData] = useState({
    logo: "/logo.png",
    cta: "Get Started",
    items: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Our specialities", href: "/rasoi" },
      { name: "Contact", href: "/contact" }
    ]
  })

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const docRef = doc(firestore, "Home","navbar")
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          const items = [
            { name: data.item1 || "Home", href: "/" },
            { name: data.item2 || "About", href: "/about" },
            { name: data.item3 || "Our specialities", href: "/rasoi" },
            { name: data.item4 || "Trending", href: "/trending" },
            { name: data.item5 || "Contact", href: "/contact" }
          ].filter(item => item.name) // Remove empty items

          setNavData({
            logo: data.logo || "/logo.png",
            cta: data.cta || "Get Started",
            items
          })
        }
      } catch (error) {
        console.error("Error fetching navigation data:", error)
      }
    }

    fetchNavData()
  }, [])

  return (
    <nav className="sticky top-0 z-49 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={navData.logo}
                alt="Logo"
                width={32}
                height={32}
                className="h-48 w-48"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navData.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={"/login"}>
            <Button variant="outline" size="sm">
              Login
            </Button>
            </Link>
            <Button size="sm">{navData.cta}</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {navData.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                    <Button className="w-full">{navData.cta}</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}