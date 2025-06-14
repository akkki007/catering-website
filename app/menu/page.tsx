import { Utensils } from "lucide-react"
import MenuSection from "@/components/menu-section"
import { menuData } from "@/lib/menu-data"
import { ThemeSelector } from "@/components/theme-selector"
import { Navbar } from "@/components/navbar"

export default function MenuPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(menuData).map(([category, items]) => (
            <MenuSection key={category} title={category} items={items} />
          ))}
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-6 px-4 text-center mt-8">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} रसोई Restaurant. All rights reserved.</p>
          <p className="text-primary-foreground/80 mt-2">Authentic Indian Flavors</p>
        </div>
      </footer>
    </div>
  )
}
