"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Upload,
  Home,
  TrendingUp,
  Package,
  Layers,
  LogOut,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Menu,
  X,
  Eye,
  EyeOff,
} from "lucide-react"
import Image from "next/image"
import { ThemeSelector } from "@/components/theme-selector"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, deleteDoc, getDocs } from "firebase/firestore"
import AdminNavbar from "@/components/admin-navbar"
import AdminSidebar from "@/components/admin-sidebar"

interface Service {
  id: string
  title: string
  description: string
  imageUrl: string
}

interface SocialLinks {
  instagram: string
  facebook: string
  twitter: string
  linkedin: string
}

interface HeroSection {
  text: string
  imageUrl: string
}

// Add this debounce utility at the top
const useDebounce = (callback: Function, delay: number) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>()

  return useCallback(
    (...args: any[]) => {
      clearTimeout(debounceTimer)
      const newTimer = setTimeout(() => callback(...args), delay)
      setDebounceTimer(newTimer)
    },
    [callback, delay, debounceTimer],
  )
}


// Add this image compression utility
const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new window.Image()

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          resolve(new File([blob!], file.name, { type: "image/jpeg" }))
        },
        "image/jpeg",
        quality,
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

// Cloudinary upload function
const uploadToCloudinary = async (file: File): Promise<string> => {
  // Compress image before upload
  const compressedFile = await compressImage(file)

  const formData = new FormData()
  formData.append('file', compressedFile)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

const ServiceCard = React.memo(({ service }: { service: Service }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <div className="relative aspect-video w-full">
        {service.imageUrl ? (
          <Image src={service.imageUrl || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-stone-200 flex items-center justify-center">
            <Package className="w-8 h-8 text-stone-400" />
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-stone-800 mb-2">{service.title || "Untitled Service"}</h3>
        <p className="text-stone-600 text-sm mb-4 flex-1">{service.description || "No description provided"}</p>
        <Button variant="outline" size="sm" className="mt-auto w-full bg-transparent">
          Learn more
        </Button>
      </div>
    </div>
  )
})

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdminView, setIsAdminView] = useState(true)
  const [heroSection, setHeroSection] = useState<HeroSection>({
    text: "",
    imageUrl: "",
  })
  const [services, setServices] = useState<Service[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
  })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadingServiceId, setUploadingServiceId] = useState<string | null>(null)
  const [savingHero, setSavingHero] = useState(false)
  const [savingService, setSavingService] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // --- HERO SECTION DRAFT STATE ---
  const [heroDraft, setHeroDraft] = useState<HeroSection>({ text: "", imageUrl: "" })
  const [heroLoaded, setHeroLoaded] = useState(false)

  // Fetch hero section from Firestore on mount
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const heroDoc = await getDoc(doc(db, "Home", "hero-section"))
        if (heroDoc.exists()) {
          // Support both snake_case and camelCase for backward compatibility
          setHeroDraft({
            text: heroDoc.data().text || heroDoc.data()["hero-text"] || "",
            imageUrl: heroDoc.data().imageUrl || heroDoc.data()["hero-img"] || "",
          })
        }
      } catch (error) {
        setToast({ message: "Failed to fetch hero section.", type: "error" })
      } finally {
        setHeroLoaded(true)
      }
    }
    fetchHero()
  }, [])

  const handleHeroDraftTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeroDraft((prev) => ({ ...prev, text: e.target.value }))
  }

  const handleHeroDraftImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      setHeroDraft((prev) => ({ ...prev, imageUrl }))
    } catch (error) {
      setToast({ message: "Failed to upload image.", type: "error" })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitHero = async () => {
    setSavingHero(true)
    try {
      // Save both camelCase and snake_case for backward compatibility
      await updateDoc(doc(db, "Home", "hero-section"), {
        text: heroDraft.text,
        imageUrl: heroDraft.imageUrl,
        "hero-text": heroDraft.text,
        "hero-img": heroDraft.imageUrl,
      })
      setToast({ message: "Hero section updated!", type: "success" })
    } catch (error) {
      setToast({ message: "Failed to update hero section.", type: "error" })
    } finally {
      setSavingHero(false)
    }
  }

  const handleCancelHero = () => {
    // Refetch from Firestore
    setHeroLoaded(false)
    const fetchHero = async () => {
      try {
        const heroDoc = await getDoc(doc(db, "Home", "hero-section"))
        if (heroDoc.exists()) {
          setHeroDraft({
            text: heroDoc.data().text || heroDoc.data()["hero-text"] || "",
            imageUrl: heroDoc.data().imageUrl || heroDoc.data()["hero-img"] || "",
          })
        }
      } catch {}
      setHeroLoaded(true)
    }
    fetchHero()
  }


  const fetchData = async () => {
    try {
      setLoading(true)

      // Use Promise.all for parallel data fetching
      const [heroDoc, servicesSnapshot, socialDoc] = await Promise.all([
        getDoc(doc(db, "Home", "hero-section")),
        getDocs(collection(db, "Services")),
        getDoc(doc(db, "social", "links")),
      ])

      // Process hero section
      if (heroDoc.exists()) {
        setHeroSection({
          text: heroDoc.data().text || "",
          imageUrl: heroDoc.data().imageUrl || "",
        })
      }

      // Process services
      const servicesData: Service[] = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "",
        description: doc.data().description || "",
        imageUrl: doc.data().img || doc.data().imageUrl || "",
      }))

      setServices(servicesData)

      // Process social links
      if (socialDoc.exists()) {
        setSocialLinks({
          instagram: socialDoc.data().instagram || "",
          facebook: socialDoc.data().facebook || "",
          twitter: socialDoc.data().twitter || "",
          linkedin: socialDoc.data().linkedin || "",
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      // Add user-friendly error state
      alert("Failed to load data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  // Add useEffect to call fetchData only once when component mounts
  useEffect(() => {
    fetchData()
  }, []) // Empty dependency array means this runs only once

  const addService = async () => {
    try {
      // Create new service document directly in Services collection
      const newServiceRef = await addDoc(collection(db, "Services"), {
        title: "",
        description: "",
        img: "",
      })

      const newService: Service = {
        id: newServiceRef.id,
        title: "",
        description: "",
        imageUrl: "",
      }

      setServices((prevServices) => [...prevServices, newService])
      setToast({ message: "Service added successfully!", type: "success" })
    } catch (error) {
      console.error("Error adding service:", error)
      alert("Failed to add service. Please try again.")
      setToast({ message: "Failed to add service.", type: "error" })
    }
  }


  const deleteService = async (id: string) => {
    try {
      // Delete the service document from Services collection
      await deleteDoc(doc(db, "Services", id))

      // Update local state
      setServices((prevServices) => prevServices.filter((service) => service.id !== id))
      setToast({ message: "Service deleted successfully!", type: "success" })
    } catch (error) {
      console.error("Error deleting service:", error)
      alert("Failed to delete service. Please try again.")
      setToast({ message: "Failed to delete service.", type: "error" })
    }
  }

  // --- SERVICES DRAFT STATE ---
  const [servicesDraft, setServicesDraft] = useState<Service[]>([])
  const [servicesLoaded, setServicesLoaded] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesSnapshot = await getDocs(collection(db, "Services"))
        const servicesData: Service[] = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "",
          description: doc.data().description || "",
          imageUrl: doc.data().img || doc.data().imageUrl || "",
        }))
        setServicesDraft(servicesData)
      } catch (error) {
        setToast({ message: "Failed to fetch services.", type: "error" })
      } finally {
        setServicesLoaded(true)
      }
    }
    fetchServices()
  }, [])

  const handleServiceDraftChange = (id: string, field: keyof Service, value: string) => {
    setServicesDraft((prev) =>
      prev.map((service) => (service.id === id ? { ...service, [field]: value } : service)),
    )
  }

  const handleServiceDraftImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingServiceId(id)
    try {
      const imageUrl = await uploadToCloudinary(file)
      setServicesDraft((prev) =>
        prev.map((service) => (service.id === id ? { ...service, imageUrl } : service)),
      )
    } catch (error) {
      setToast({ message: "Failed to upload service image.", type: "error" })
    } finally {
      setUploadingServiceId(null)
    }
  }

  const handleSubmitServices = async () => {
    setSavingService("all")
    try {
      for (const draft of servicesDraft) {
        await updateDoc(doc(db, "Services", draft.id), {
          title: draft.title,
          description: draft.description,
          img: draft.imageUrl,
        })
      }
      setToast({ message: "Services updated!", type: "success" })
    } catch (error) {
      setToast({ message: "Failed to update services.", type: "error" })
    } finally {
      setSavingService(null)
    }
  }

  const handleCancelServices = () => {
    setServicesLoaded(false)
    const fetchServices = async () => {
      try {
        const servicesSnapshot = await getDocs(collection(db, "Services"))
        const servicesData: Service[] = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "",
          description: doc.data().description || "",
          imageUrl: doc.data().img || doc.data().imageUrl || "",
        }))
        setServicesDraft(servicesData)
      } catch {}
      setServicesLoaded(true)
    }
    fetchServices()
  }

  // --- SOCIAL LINKS DRAFT STATE ---
  const [socialLinksDraft, setSocialLinksDraft] = useState<SocialLinks>({ instagram: "", facebook: "", twitter: "", linkedin: "" })
  const [socialLinksLoaded, setSocialLinksLoaded] = useState(false)

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const socialDoc = await getDoc(doc(db, "social", "links"))
        if (socialDoc.exists()) {
          setSocialLinksDraft({
            instagram: socialDoc.data().instagram || "",
            facebook: socialDoc.data().facebook || "",
            twitter: socialDoc.data().twitter || "",
            linkedin: socialDoc.data().linkedin || "",
          })
        }
      } catch (error) {
        setToast({ message: "Failed to fetch social links.", type: "error" })
      } finally {
        setSocialLinksLoaded(true)
      }
    }
    fetchSocialLinks()
  }, [])

  const handleSocialLinkDraftChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinksDraft((prev) => ({ ...prev, [platform]: value }))
  }

  const handleSubmitSocialLinks = async () => {
    try {
      await updateDoc(doc(db, "social", "links"), { ...socialLinksDraft })
      setToast({ message: "Social links updated!", type: "success" })
    } catch (error) {
      setToast({ message: "Failed to update social links.", type: "error" })
    }
  }

  const handleCancelSocialLinks = () => {
    setSocialLinksLoaded(false)
    const fetchSocialLinks = async () => {
      try {
        const socialDoc = await getDoc(doc(db, "social", "links"))
        if (socialDoc.exists()) {
          setSocialLinksDraft({
            instagram: socialDoc.data().instagram || "",
            facebook: socialDoc.data().facebook || "",
            twitter: socialDoc.data().twitter || "",
            linkedin: socialDoc.data().linkedin || "",
          })
        }
      } catch {}
      setSocialLinksLoaded(true)
    }
    fetchSocialLinks()
  }

  // Add useEffect for keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            // Save current changes
            break
          case "n":
            e.preventDefault()
            if (isAdminView) addService()
            break
          case "p":
            e.preventDefault()
            setIsAdminView(!isAdminView)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isAdminView])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-800"></div>
      </div>
    )
  }

  // Add this component for toast notifications
  const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <AdminNavbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <div className="flex relative">
        {/* Mobile Menu Overlay and Sidebar now handled by AdminSidebar */}
        <AdminSidebar
  isMobileMenuOpen={isMobileMenuOpen}
  setIsMobileMenuOpen={setIsMobileMenuOpen}
  activeTab="home" // or "home", "products", "popups" depending on the current page
/>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-0">
          {!isAdminView ? (
            <>
              {/* Public View */}
              <section className="mb-12">
                <div className="relative rounded-xl overflow-hidden mb-8 h-96">
                  {heroSection.imageUrl ? (
                    <Image
                      src={heroSection.imageUrl || "/placeholder.svg"}
                      alt="Hero banner"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                      <Home className="w-12 h-12 text-stone-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white max-w-2xl px-4">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        {heroSection.text || "Welcome to Our Website"}
                      </h1>
                      <Button className="bg-white text-stone-800 hover:bg-stone-100">Get Started</Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Services Display */}
              <section className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2">Our Services</h2>
                  <p className="text-stone-600 max-w-2xl mx-auto">
                    We offer a wide range of professional services to meet your needs
                  </p>
                </div>

                {services.length === 0 ? (
                  <div className="bg-stone-50 rounded-lg p-8 text-center">
                    <Package className="w-10 h-10 mx-auto text-stone-400 mb-4" />
                    <p className="text-stone-600">No services available yet. Please check back later.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              {/* Admin View */}
              {/* Hero Section */}
              <section className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-800 mb-4 sm:mb-6">Hero section</h2>
                <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-stone-200">
                  {heroDraft.imageUrl && (
                    <div className="relative mb-6 aspect-video">
                      <Image
                        src={heroDraft.imageUrl || "/placeholder.svg"}
                        alt="Hero banner"
                        fill
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <input
  type="file"
  id="hero-image-upload"
  accept="image/*"
  onChange={handleHeroDraftImageUpload}
  className="hidden"
  disabled={uploading}
/>
<Button
  variant="outline"
  className="h-12 text-stone-600 border-stone-300 bg-transparent w-full"
  disabled={uploading}
  onClick={() => document.getElementById('hero-image-upload')?.click()}
>
  <Upload className="w-4 h-4 mr-2" />
  {uploading ? "Uploading..." : "Hero Img Upload"}
  <Plus className="w-4 h-4 ml-auto" />
</Button>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Hero Text"
                        value={heroDraft.text}
                        onChange={handleHeroDraftTextChange}
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleSubmitHero} disabled={savingHero || uploading}>
                      {savingHero ? "Submitting..." : "Submit"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelHero} disabled={savingHero || uploading}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </section>

              {/* Services Section - Admin Controls */}
              <section className="mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-stone-800">Manage Services</h2>
                    <p className="text-sm text-stone-500">Add, edit or remove services</p>
                  </div>
                  <Button onClick={addService} className="bg-stone-800 hover:bg-stone-900 text-white w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {servicesDraft.map((service) => (
                    <Card key={service.id} className="bg-white border-stone-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                          {service.imageUrl ? (
                            <div className="w-full sm:w-24 h-24 rounded-lg flex-shrink-0 overflow-hidden">
                              <Image
                                src={service.imageUrl || "/placeholder.svg"}
                                alt={service.title}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full sm:w-24 h-24 bg-stone-200 rounded-lg flex-shrink-0"></div>
                          )}
                          <div className="flex-1 space-y-3">
                            <Input
                              placeholder="Title"
                              value={service.title}
                              onChange={(e) => handleServiceDraftChange(service.id, "title", e.target.value)}
                              className="font-medium"
                            />
                            <Textarea
                              placeholder="Description"
                              value={service.description}
                              onChange={(e) => handleServiceDraftChange(service.id, "description", e.target.value)}
                              className="resize-none"
                              rows={2}
                            />
                            <div className="flex space-x-2">
                              <div>
                              <input
  type="file"
  id={`service-image-${service.id}`}
  accept="image/*"
  onChange={(e) => handleServiceDraftImageUpload(e, service.id)}
  className="hidden"
  disabled={uploadingServiceId === service.id}
/>
<Button
  variant="outline"
  size="sm"
  className="text-xs bg-transparent"
  disabled={uploadingServiceId === service.id}
  onClick={() => document.getElementById(`service-image-${service.id}`)?.click()}
>
  <Upload className="w-3 h-3 mr-1" />
  {uploadingServiceId === service.id
    ? "Uploading..."
    : service.imageUrl
      ? "Change photo"
      : "Upload photo"}
</Button>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs bg-transparent text-red-500 border-red-200 hover:bg-red-50"
                                onClick={() => deleteService(service.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSubmitServices} disabled={savingService === "all"}>
                    {savingService === "all" ? "Submitting..." : "Submit"}
                  </Button>
                  <Button variant="outline" onClick={handleCancelServices} disabled={savingService === "all"}>
                    Cancel
                  </Button>
                </div>
              </section>

              {/* Social Links Section */}
              <section className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-800 mb-4 sm:mb-6">Social links</h2>

                <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-stone-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        placeholder="Instagram"
                        value={socialLinksDraft.instagram}
                        onChange={(e) => handleSocialLinkDraftChange("instagram", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        placeholder="Facebook"
                        value={socialLinksDraft.facebook}
                        onChange={(e) => handleSocialLinkDraftChange("facebook", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        placeholder="Twitter"
                        value={socialLinksDraft.twitter}
                        onChange={(e) => handleSocialLinkDraftChange("twitter", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        placeholder="LinkedIn"
                        value={socialLinksDraft.linkedin}
                        onChange={(e) => handleSocialLinkDraftChange("linkedin", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSubmitSocialLinks}>
                    Submit
                  </Button>
                  <Button variant="outline" onClick={handleCancelSocialLinks}>
                    Cancel
                  </Button>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
