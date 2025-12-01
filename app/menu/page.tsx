"use client"

import { useState, useEffect } from "react"
import { Utensils } from "lucide-react"
import MenuSection from "@/components/menu-section"
import { Navbar } from "@/components/navbar"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { MenuDataType } from "@/lib/menu-data"
import { menuData as defaultMenuData } from "@/lib/menu-data"

export default function MenuPage() {
  const [menuData, setMenuData] = useState<MenuDataType>(defaultMenuData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      const menuDoc = await getDoc(doc(db, "Menu", "main"))
      if (menuDoc.exists()) {
        const data = menuDoc.data() as MenuDataType
        if (Object.keys(data).length > 0) {
          setMenuData(data)
        }
      }
    } catch (error) {
      console.error("Error fetching menu data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <header className="bg-primary text-primary-foreground py-8 px-4 text-center">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Utensils className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold">रसोई</h1>
            <Utensils className="h-8 w-8" />
          </div>
          <p className="text-primary-foreground/80 text-lg">Traditional Indian Cuisine</p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {Object.keys(menuData).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Menu coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(menuData).map(([category, items]) => (
              <MenuSection key={category} title={category} items={items} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
