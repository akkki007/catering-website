// add the adminnavbar and admin sidebar here
"use client"
import AdminNavbar from '@/components/admin-navbar'
import AdminSidebar from '@/components/admin-sidebar'
import React, { useState } from 'react'

export const page = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <div>
        <AdminNavbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <AdminSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} activeTab="popups" />
    </div>
  )
}

export default page;