"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import AdminNavbar from "@/components/admin-navbar"

interface TrendingItem {
  id: string
  name: string
  price: string
  unit: string
  image: string
  category: string
  rating: number
  description: string
  features: string[]
  trending: boolean
  discount: number
}

export default function AdminPage() {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState<Omit<TrendingItem, "id">>({
    name: "",
    price: "",
    unit: "Per Piece",
    image: "",
    category: "",
    rating: 4.0,
    description: "",
    features: [],
    trending: false,
    discount: 0,
  })
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    fetchTrendingItems()
  }, [])

  const fetchTrendingItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Trending"))
      const items: TrendingItem[] = []
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        } as TrendingItem)
      })
      setTrendingItems(items)
    } catch (error) {
      console.error("Error fetching trending items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    try {
      await addDoc(collection(db, "Trending"), newItem)
      setNewItem({
        name: "",
        price: "",
        unit: "Per Piece",
        image: "",
        category: "",
        rating: 4.0,
        description: "",
        features: [],
        trending: false,
        discount: 0,
      })
      fetchTrendingItems()
    } catch (error) {
      console.error("Error adding document:", error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Trending", id))
      fetchTrendingItems()
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setNewItem({
        ...newItem,
        features: [...newItem.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...newItem.features]
    updatedFeatures.splice(index, 1)
    setNewItem({
      ...newItem,
      features: updatedFeatures,
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
            <h1 className="text-3xl font-bold mb-8">Trending Items Admin</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add New Item Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Trending Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Item name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <Input
                          type="text"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                          placeholder="Item price"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Unit</label>
                        <Input
                          value={newItem.unit}
                          onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                          placeholder="Per Piece"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <Input
                        value={newItem.image}
                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                        placeholder="Image URL"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Input
                          value={newItem.category}
                          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                          placeholder="Category"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={newItem.rating}
                          onChange={(e) => setNewItem({ ...newItem, rating: Number.parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Input
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Discount (%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={newItem.discount}
                        onChange={(e) => setNewItem({ ...newItem, discount: Number.parseInt(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Features</label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Add feature"
                          onKeyPress={(e) => e.key === "Enter" && addFeature()}
                        />
                        <Button onClick={addFeature} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newItem.features.map((feature, index) => (
                          <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                            {feature}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 h-6 w-6 p-0"
                              onClick={() => removeFeature(index)}
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="trending"
                        checked={newItem.trending}
                        onChange={(e) => setNewItem({ ...newItem, trending: e.target.checked })}
                      />
                      <label htmlFor="trending" className="text-sm font-medium">
                        Trending Item
                      </label>
                    </div>

                    <Button onClick={handleAddItem} className="w-full">
                      Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Items List */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Trending Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendingItems.length === 0 ? (
                      <p className="text-gray-500">No trending items found</p>
                    ) : (
                      <div className="space-y-4">
                        {trendingItems.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
