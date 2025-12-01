"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, X } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import AdminNavbar from "@/components/admin-navbar"
import type { MenuDataType, MenuItemType } from "@/lib/menu-data"

export default function MenuAdminPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [menuData, setMenuData] = useState<MenuDataType>({})
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [newItem, setNewItem] = useState<MenuItemType>({ name: "", price: "", description: "" })

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      const menuDoc = await getDoc(doc(db, "Menu", "main"))
      if (menuDoc.exists()) {
        setMenuData(menuDoc.data() as MenuDataType)
      } else {
        // Initialize with empty data if document doesn't exist
        setMenuData({})
      }
    } catch (error) {
      console.error("Error fetching menu data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "Menu", "main"), menuData)
      alert("Menu updated successfully!")
    } catch (error) {
      console.error("Error saving menu:", error)
      alert("Failed to save menu. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !menuData[newCategory]) {
      setMenuData({ ...menuData, [newCategory]: [] })
      setNewCategory("")
      setEditingCategory(newCategory)
    }
  }

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Are you sure you want to delete the category "${category}"?`)) {
      const updated = { ...menuData }
      delete updated[category]
      setMenuData(updated)
    }
  }

  const handleAddItem = (category: string) => {
    if (newItem.name.trim() && newItem.price.trim()) {
      const updated = {
        ...menuData,
        [category]: [...(menuData[category] || []), { ...newItem }],
      }
      setMenuData(updated)
      setNewItem({ name: "", price: "", description: "" })
    }
  }

  const handleUpdateItem = (category: string, index: number, field: keyof MenuItemType, value: string) => {
    const updated = { ...menuData }
    if (updated[category] && updated[category][index]) {
      updated[category][index] = { ...updated[category][index], [field]: value }
      setMenuData(updated)
    }
  }

  const handleDeleteItem = (category: string, index: number) => {
    const updated = { ...menuData }
    if (updated[category]) {
      updated[category] = updated[category].filter((_, i) => i !== index)
      setMenuData(updated)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex">
        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeTab="menu"
        />
        <main className="flex-1 md:ml-0">
          <div className="container mx-auto py-8 px-4 sm:px-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Menu Management</h1>
              <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save All Changes"}
              </Button>
            </div>

            {/* Add New Category */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Category name (e.g., रोटी / ब्रेड)"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </div>
              </CardContent>
            </Card>

            {/* Menu Categories */}
            <div className="space-y-6">
              {Object.entries(menuData).map(([category, items]) => (
                <Card key={category}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">{category}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(editingCategory === category ? null : category)}
                      >
                        {editingCategory === category ? <X className="w-4 h-4" /> : "Edit"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          {editingCategory === category ? (
                            <>
                              <Input
                                placeholder="Item name"
                                value={item.name}
                                onChange={(e) => handleUpdateItem(category, index, "name", e.target.value)}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  placeholder="Price"
                                  value={item.price}
                                  onChange={(e) => handleUpdateItem(category, index, "price", e.target.value)}
                                />
                                <Input
                                  placeholder="Description (optional)"
                                  value={item.description || ""}
                                  onChange={(e) => handleUpdateItem(category, index, "description", e.target.value)}
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteItem(category, index)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Item
                              </Button>
                            </>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                {item.description && (
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                )}
                              </div>
                              <p className="font-semibold text-primary">₹{item.price}</p>
                            </div>
                          )}
                        </div>
                      ))}

                      {editingCategory === category && (
                        <Card className="border-dashed">
                          <CardContent className="pt-6">
                            <div className="space-y-2">
                              <Input
                                placeholder="Item name"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  placeholder="Price"
                                  value={newItem.price}
                                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                />
                                <Input
                                  placeholder="Description (optional)"
                                  value={newItem.description || ""}
                                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                />
                              </div>
                              <Button
                                onClick={() => handleAddItem(category)}
                                className="w-full"
                                variant="outline"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Item
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {Object.keys(menuData).length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    No categories yet. Add a category to get started.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

