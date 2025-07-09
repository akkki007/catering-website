import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, TrendingUp, Package, Layers, LogOut } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"

interface AdminSidebarProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  activeTab: "home" | "trending" | "products" | "popups"
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen, activeTab }) => {
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 
          transform transition-transform duration-300 ease-in-out md:transform-none
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6">
          <div className="md:hidden mb-4 pb-4 border-b border-stone-200">
            <nav className="flex flex-col space-y-2">
              <Link href="/admin" passHref legacyBehavior>
                <Button asChild variant={activeTab === "home" ? "default" : "ghost"} className={`justify-start text-stone-700 ${activeTab === "home" ? "bg-stone-200" : ""}`}>
                  <a><Home className="w-4 h-4 mr-2" />Home</a>
                </Button>
              </Link>
              <ThemeSelector />
              <Button className="justify-start bg-red-500 hover:bg-red-600 text-white mt-4">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
          <nav className="space-y-2">
            <Link href="/" passHref legacyBehavior>
              <Button asChild variant={activeTab === "home" ? "default" : "ghost"} className={`w-full justify-start ${activeTab === "home" ? "bg-stone-200 text-stone-900" : "text-stone-700"}`}>
                <a><Home className="w-4 h-4 mr-3" />Home Page</a>
              </Button>
            </Link>
            <Link href="/trending" passHref legacyBehavior>
              <Button asChild variant={activeTab === "trending" ? "default" : "ghost"} className={`w-full justify-start ${activeTab === "trending" ? "bg-stone-200 text-stone-900" : "text-stone-600"}`}>
                <a><TrendingUp className="w-4 h-4 mr-3" />Trending</a>
              </Button>
            </Link>
            <Link href="/products" passHref legacyBehavior>
              <Button asChild variant={activeTab === "products" ? "default" : "ghost"} className={`w-full justify-start ${activeTab === "products" ? "bg-stone-200 text-stone-900" : "text-stone-600"}`}>
                <a><Package className="w-4 h-4 mr-3" />Products</a>
              </Button>
            </Link>
            <Link href="/popups" passHref legacyBehavior>
              <Button asChild variant={activeTab === "popups" ? "default" : "ghost"} className={`w-full justify-start ${activeTab === "popups" ? "bg-stone-200 text-stone-900" : "text-stone-600"}`}>
                <a><Layers className="w-4 h-4 mr-3" />Popups</a>
              </Button>
            </Link>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar; 