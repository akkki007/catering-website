"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Edit2, X, Save } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import AdminNavbar from "@/components/admin-navbar"

interface MenuItem {
  name: string
  description: string
  isVeg: boolean
}

interface TiffinDay {
  id?: string
  day: string
  date: string
  items: MenuItem[]
  isSpecial: boolean
  specialNote: string
  order: number
}

export default function TiffinAdminPage() {
  const [tiffinDays, setTiffinDays] = useState<TiffinDay[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<Omit<TiffinDay, "id">>({
    day: "",
    date: "",
    items: [],
    isSpecial: false,
    specialNote: "",
    order: 0,
  })
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem>({
    name: "",
    description: "",
    isVeg: true,
  })

  useEffect(() => {
    fetchTiffinDays()
  }, [])

  const fetchTiffinDays = async () => {
    try {
      const q = query(collection(db, "TiffinMenu"), orderBy("order", "asc"))
      const querySnapshot = await getDocs(q)
      const days: TiffinDay[] = []
      querySnapshot.forEach((doc) => {
        days.push({
          id: doc.id,
          ...doc.data(),
        } as TiffinDay)
      })
      setTiffinDays(days)
    } catch (error) {
      console.error("Error fetching tiffin days:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    if (!newItem.day || !newItem.date || newItem.items.length === 0) {
      alert("Please fill in all required fields and add at least one menu item")
      return
    }

    try {
      await addDoc(collection(db, "TiffinMenu"), newItem)
      setNewItem({
        day: "",
        date: "",
        items: [],
        isSpecial: false,
        specialNote: "",
        order: 0,
      })
      fetchTiffinDays()
    } catch (error) {
      console.error("Error adding document:", error)
    }
  }

  const handleUpdateItem = async (id: string, data: Omit<TiffinDay, "id">) => {
    try {
      await updateDoc(doc(db, "TiffinMenu", id), data)
      setEditingId(null)
      fetchTiffinDays()
    } catch (error) {
      console.error("Error updating document:", error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this tiffin day?")) {
      try {
        await deleteDoc(doc(db, "TiffinMenu", id))
        fetchTiffinDays()
      } catch (error) {
        console.error("Error deleting document:", error)
      }
    }
  }

  const addMenuItem = () => {
    if (currentMenuItem.name.trim() && currentMenuItem.description.trim()) {
      setNewItem({
        ...newItem,
        items: [...newItem.items, currentMenuItem],
      })
      setCurrentMenuItem({
        name: "",
        description: "",
        isVeg: true,
      })
    }
  }

  const removeMenuItem = (index: number) => {
    const updatedItems = [...newItem.items]
    updatedItems.splice(index, 1)
    setNewItem({
      ...newItem,
      items: updatedItems,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <AdminNavbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeTab="trending"
        />

        {/* Main Content */}
        <main className="flex-1 md:ml-0">
          <div className="container mx-auto py-8 px-4 sm:px-6">
            <h1 className="text-3xl font-bold mb-8">Tiffin Menu Admin</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add New Tiffin Day Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Tiffin Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Day</label>
                        <Input
                          value={newItem.day}
                          onChange={(e) => setNewItem({ ...newItem, day: e.target.value })}
                          placeholder="e.g., Monday, Today"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <Input
                          value={newItem.date}
                          onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                          placeholder="e.g., Nov 5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Order</label>
                      <Input
                        type="number"
                        value={newItem.order}
                        onChange={(e) => setNewItem({ ...newItem, order: Number.parseInt(e.target.value) })}
                        placeholder="Display order"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isSpecial"
                        checked={newItem.isSpecial}
                        onChange={(e) => setNewItem({ ...newItem, isSpecial: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="isSpecial" className="text-sm font-medium">
                        Special Day
                      </label>
                    </div>

                    {newItem.isSpecial && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Special Note</label>
                        <Input
                          value={newItem.specialNote}
                          onChange={(e) => setNewItem({ ...newItem, specialNote: e.target.value })}
                          placeholder="e.g., Premium menu with extra items"
                        />
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-3">Add Menu Items</h3>
                      <div className="space-y-2">
                        <Input
                          value={currentMenuItem.name}
                          onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, name: e.target.value })}
                          placeholder="Item name (e.g., Dal Tadka)"
                        />
                        <Textarea
                          value={currentMenuItem.description}
                          onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, description: e.target.value })}
                          placeholder="Item description"
                          rows={2}
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isVeg"
                            checked={currentMenuItem.isVeg}
                            onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, isVeg: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <label htmlFor="isVeg" className="text-sm">
                            Vegetarian
                          </label>
                        </div>
                        <Button onClick={addMenuItem} size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Menu Item
                        </Button>
                      </div>
                    </div>

                    {newItem.items.length > 0 && (
                      <div className="border rounded-lg p-3 space-y-2">
                        <h4 className="font-medium text-sm">Menu Items ({newItem.items.length})</h4>
                        {newItem.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-start bg-gray-50 p-2 rounded">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => removeMenuItem(index)}
                            >
                              <X className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button onClick={handleAddItem} className="w-full">
                      Add Tiffin Day
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Tiffin Days List */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Tiffin Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tiffinDays.length === 0 ? (
                      <p className="text-gray-500">No tiffin days found</p>
                    ) : (
                      <div className="space-y-4">
                        {tiffinDays.map((tiffin) => (
                          <div key={tiffin.id} className="border rounded-lg p-4">
                            {editingId === tiffin.id ? (
                              <EditForm
                                tiffin={tiffin}
                                onSave={(data) => handleUpdateItem(tiffin.id!, data)}
                                onCancel={() => setEditingId(null)}
                              />
                            ) : (
                              <>
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg">
                                      {tiffin.day}
                                      {tiffin.isSpecial && (
                                        <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                          Special
                                        </span>
                                      )}
                                    </h3>
                                    <p className="text-sm text-gray-500">{tiffin.date}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditingId(tiffin.id!)}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteItem(tiffin.id!)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                {tiffin.specialNote && (
                                  <p className="text-xs text-orange-600 mb-2">{tiffin.specialNote}</p>
                                )}
                                <div className="space-y-1">
                                  {tiffin.items.map((item, idx) => (
                                    <div key={idx} className="text-sm">
                                      • {item.name}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function EditForm({
  tiffin,
  onSave,
  onCancel,
}: {
  tiffin: TiffinDay
  onSave: (data: Omit<TiffinDay, "id">) => void
  onCancel: () => void
}) {
  const [editData, setEditData] = useState<Omit<TiffinDay, "id">>({
    day: tiffin.day,
    date: tiffin.date,
    items: tiffin.items,
    isSpecial: tiffin.isSpecial,
    specialNote: tiffin.specialNote,
    order: tiffin.order,
  })
  const [currentItem, setCurrentItem] = useState<MenuItem>({
    name: "",
    description: "",
    isVeg: true,
  })

  const addItem = () => {
    if (currentItem.name.trim() && currentItem.description.trim()) {
      setEditData({
        ...editData,
        items: [...editData.items, currentItem],
      })
      setCurrentItem({ name: "", description: "", isVeg: true })
    }
  }

  const removeItem = (index: number) => {
    const updated = [...editData.items]
    updated.splice(index, 1)
    setEditData({ ...editData, items: updated })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={editData.day}
          onChange={(e) => setEditData({ ...editData, day: e.target.value })}
          placeholder="Day"
        />
        <Input
          value={editData.date}
          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
          placeholder="Date"
        />
      </div>
      <Input
        type="number"
        value={editData.order}
        onChange={(e) => setEditData({ ...editData, order: Number.parseInt(e.target.value) })}
        placeholder="Order"
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={editData.isSpecial}
          onChange={(e) => setEditData({ ...editData, isSpecial: e.target.checked })}
          className="w-4 h-4"
        />
        <span className="text-sm">Special Day</span>
      </div>
      {editData.isSpecial && (
        <Input
          value={editData.specialNote}
          onChange={(e) => setEditData({ ...editData, specialNote: e.target.value })}
          placeholder="Special note"
        />
      )}
      <div className="space-y-2 border-t pt-2">
        <Input
          value={currentItem.name}
          onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
          placeholder="Add item name"
        />
        <Input
          value={currentItem.description}
          onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
          placeholder="Add item description"
        />
        <Button onClick={addItem} size="sm" className="w-full">
          <Plus className="h-3 w-3 mr-1" />
          Add Item
        </Button>
      </div>
      <div className="space-y-1">
        {editData.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
            <span>{item.name}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeItem(idx)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(editData)} size="sm" className="flex-1">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm" className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}