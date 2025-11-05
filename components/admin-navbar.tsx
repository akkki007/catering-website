"use client"
import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/theme-selector"
import { LogOut, Home, Menu, X } from "lucide-react"
import Link from "next/link"

interface AdminNavbarProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <header className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 sm:space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-40 sm:w-40 h-16 sm:h-20 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={200} 
                height={170} 
                className="h-32 sm:h-40 w-auto object-contain" 
              />
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/admin" passHref legacyBehavior>
              <Button asChild variant="ghost" className="text-stone-700">
                <a><Home className="w-4 h-4 mr-2" />Home</a>
              </Button>
            </Link>
            <ThemeSelector />
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="hidden sm:flex bg-red-500 hover:bg-red-600 text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar;