"use client"
import AdminNavbar from '@/components/admin-navbar'
import AdminSidebar from '@/components/admin-sidebar'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Save, X, Upload, Eye } from "lucide-react"
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import Image from 'next/image'

interface Popup {
  id: string
  title: string
  desc: string
  price: string
  discount?: number
  img: string
  theme?: "orange" | "blue" | "green" | "purple" | "red"
}

const themeOptions = [
  { value: "orange", label: "Orange", color: "bg-orange-500" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
]

const AdminPopupsPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [popups, setPopups] = useState<Popup[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPopup, setEditingPopup] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [currentViewing, setCurrentViewing] = useState<string>("")
  
  // Form state
  const [formData, setFormData] = useState<{
    title: string
    desc: string
    price: string
    discount: string
    img: string
    theme: "orange" | "blue" | "green" | "purple" | "red"
  }>({
    title: '',
    desc: '',
    price: '',
    discount: '',
    img: '',
    theme: 'orange'
  })

  // Fetch popups from Firebase
  const fetchPopups = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'Ads'))
      const fetchedPopups: Popup[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedPopups.push({
          id: doc.id,
          title: data.title || "",
          desc: data.desc || "",
          price: data.price || "",
          discount: data.discount || 0,
          img: data.img || "",
          theme: data.theme || "orange"
        })
      })

      setPopups(fetchedPopups)
      if (fetchedPopups.length > 0 && !currentViewing) {
        setCurrentViewing(fetchedPopups[0].title)
      }
    } catch (error) {
      console.error("Error fetching popups:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPopups()
  }, [])

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Start editing a popup
  const startEdit = (popup: Popup) => {
    setEditingPopup(popup.id)
    setIsAddingNew(false)
    setFormData({
      title: popup.title,
      desc: popup.desc,
      price: popup.price,
      discount: popup.discount?.toString() || '',
      img: popup.img,
      theme: popup.theme || 'orange'
    })
  }

  // Start adding new popup
  const startAddNew = () => {
    setIsAddingNew(true)
    setEditingPopup(null)
    setFormData({
      title: '',
      desc: '',
      price: '',
      discount: '',
      img: '',
      theme: 'orange'
    })
  }

  // Save popup (add or update)
  const savePopup = async () => {
    try {
      const popupData = {
        title: formData.title,
        desc: formData.desc,
        price: formData.price,
        discount: formData.discount ? parseInt(formData.discount) : 0,
        img: formData.img,
        theme: formData.theme
      }

      if (isAddingNew) {
        await addDoc(collection(db, 'Ads'), popupData)
      } else if (editingPopup) {
        await updateDoc(doc(db, 'Ads', editingPopup), popupData)
      }

      setEditingPopup(null)
      setIsAddingNew(false)
      setFormData({
        title: '',
        desc: '',
        price: '',
        discount: '',
        img: '',
        theme: 'orange'
      })
      
      await fetchPopups()
    } catch (error) {
      console.error("Error saving popup:", error)
    }
  }

  // Delete popup
  const deletePopup = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this popup?')) {
      try {
        await deleteDoc(doc(db, 'Ads', id))
        await fetchPopups()
      } catch (error) {
        console.error("Error deleting popup:", error)
      }
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingPopup(null)
    setIsAddingNew(false)
    setFormData({
      title: '',
      desc: '',
      price: '',
      discount: '',
      img: '',
      theme: 'orange'
    })
  }

  const currentPopup = popups.find(p => p.title === currentViewing)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <AdminSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} activeTab="popups" />
      
      {/* Main Content */}
      <div className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your ads</h1>
              <p className="text-gray-600 mt-1">Manage your popup advertisements</p>
            </div>
            <Button 
              onClick={startAddNew}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isAddingNew || editingPopup !== null}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Popup
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isAddingNew ? (
                      <>
                        <Plus className="w-5 h-5" />
                        Add New Popup
                      </>
                    ) : editingPopup ? (
                      <>
                        <Edit2 className="w-5 h-5" />
                        Edit Popup
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        Popup Details
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product name
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter product name"
                      disabled={!isAddingNew && !editingPopup}
                    />
                  </div>

                  {/* Product Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product price
                    </label>
                    <Input
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="40"
                      disabled={!isAddingNew && !editingPopup}
                    />
                  </div>

                  {/* Product Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product description
                    </label>
                    <Textarea
                      value={formData.desc}
                      onChange={(e) => handleInputChange('desc', e.target.value)}
                      placeholder="Traditional Diwali sweets and snacks collection featuring authentic homemade faral varieties"
                      className="min-h-[100px]"
                      disabled={!isAddingNew && !editingPopup}
                    />
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount in %
                    </label>
                    <Input
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      placeholder="20"
                      type="number"
                      disabled={!isAddingNew && !editingPopup}
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.img}
                        onChange={(e) => handleInputChange('img', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        disabled={!isAddingNew && !editingPopup}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={!isAddingNew && !editingPopup}
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product theme
                    </label>
                    <Select
                      value={formData.theme}
                      onValueChange={(value) => handleInputChange('theme', value)}
                      disabled={!isAddingNew && !editingPopup}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themeOptions.map((theme) => (
                          <SelectItem key={theme.value} value={theme.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${theme.color}`}></div>
                              {theme.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  {(isAddingNew || editingPopup) && (
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={savePopup}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={cancelEdit}
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview and List */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Now Viewing Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Now viewing
                </label>
                <Select value={currentViewing} onValueChange={setCurrentViewing}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a popup to view" />
                  </SelectTrigger>
                  <SelectContent>
                    {popups.map((popup) => (
                      <SelectItem key={popup.id} value={popup.title}>
                        {popup.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview Card */}
              {currentPopup && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                        
                        {/* Header with theme color */}
                        <div className={`bg-gradient-to-br ${
                          currentPopup.theme === 'orange' ? 'from-orange-400 to-orange-600' :
                          currentPopup.theme === 'blue' ? 'from-blue-400 to-blue-600' :
                          currentPopup.theme === 'green' ? 'from-green-400 to-green-600' :
                          currentPopup.theme === 'purple' ? 'from-purple-400 to-purple-600' :
                          'from-red-400 to-red-600'
                        } p-6 text-white relative overflow-hidden`}>
                          
                          {/* Decorative elements */}
                          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full"></div>
                          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>

                          {/* Product Image */}
                          <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                              {currentPopup.img ? (
                                <Image
                                  src={currentPopup.img}
                                  alt={currentPopup.title}
                                  width={80}
                                  height={80}
                                  className="object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-4xl">🛒</span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="text-center">
                            <h3 className="text-lg font-bold mb-2">{currentPopup.title}</h3>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <span className="text-2xl font-bold">${currentPopup.price}</span>
                              {currentPopup.discount && currentPopup.discount > 0 && (
                                <span className="text-sm line-through opacity-70">
                                  ${(parseFloat(currentPopup.price) * (1 + currentPopup.discount / 100)).toFixed(2)}
                                </span>
                              )}
                            </div>
                            {currentPopup.discount && currentPopup.discount > 0 && (
                              <Badge className="bg-white text-green-600">
                                Save {currentPopup.discount}%
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                          <p className="text-gray-600 text-sm text-center mb-4">
                            {currentPopup.desc}
                          </p>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Order Now - ${currentPopup.price}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Popups List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Popups ({popups.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : popups.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No popups found. Create your first popup!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {popups.map((popup) => (
                        <div 
                          key={popup.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                              {popup.img ? (
                                <Image
                                  src={popup.img}
                                  alt={popup.title}
                                  width={48}
                                  height={48}
                                  className="object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-2xl">🛒</span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">{popup.title}</h4>
                              <p className="text-sm text-gray-600">
                                ${popup.price} 
                                {popup.discount && popup.discount > 0 && (
                                  <span className="ml-2 text-green-600">
                                    ({popup.discount}% off)
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-3 h-3 rounded ${
                                  popup.theme === 'orange' ? 'bg-orange-500' :
                                  popup.theme === 'blue' ? 'bg-blue-500' :
                                  popup.theme === 'green' ? 'bg-green-500' :
                                  popup.theme === 'purple' ? 'bg-purple-500' :
                                  'bg-red-500'
                                }`}></div>
                                <span className="text-xs text-gray-500 capitalize">{popup.theme}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(popup)}
                              disabled={isAddingNew || editingPopup !== null}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deletePopup(popup.id)}
                              className="text-red-600 hover:text-red-700"
                              disabled={isAddingNew || editingPopup !== null}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPopupsPage