"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Groq from "groq-sdk"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Eye, Search, Grid, List, Pin, Sparkles, RefreshCw, Loader2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Navbar } from "@/components/navbar"

interface Product {
  id: string
  title: string
  description: string
  price: string
  photolink?: string
  category?: string
  popupOkay?: string
  pinned?: string
}

interface PopupProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

interface TranslationCache {
  translations: Record<string, string[]>
  lastUpdated: number
  version: string
}

// Optimized Groq AI service with smart caching and rate limiting
class OptimizedGroqService {
  private groq: Groq
  private cache: Map<string, string[]> = new Map()
  private cacheKey = 'groq-translations-cache-v2'
  private lastCacheUpdate = 0
  private readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds
  private readonly RATE_LIMIT_DELAY = 100 // 100ms between requests
  private isInitialized = false

  constructor(apiKey: string) {
    this.groq = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    })
    this.loadCacheFromMemory()
  }

  private loadCacheFromMemory() {
    try {
      if (typeof window !== 'undefined' && (window as any).groqTranslationCache) {
        const cached: TranslationCache = (window as any).groqTranslationCache
        
        // Check if cache is still valid (within 1 hour)
        const now = Date.now()
        if (cached.lastUpdated && (now - cached.lastUpdated) < this.CACHE_DURATION) {
          this.cache = new Map(Object.entries(cached.translations))
          this.lastCacheUpdate = cached.lastUpdated
          this.isInitialized = true
          console.log(`Loaded ${this.cache.size} cached translations (${Math.round((now - cached.lastUpdated) / (1000 * 60))} minutes old)`)
          return
        } else {
          console.log('Translation cache expired, will refresh')
        }
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error)
    }
  }

  private saveCacheToMemory() {
    try {
      if (typeof window !== 'undefined') {
        const cacheData: TranslationCache = {
          translations: Object.fromEntries(this.cache),
          lastUpdated: Date.now(),
          version: 'v2'
        }
        ;(window as any).groqTranslationCache = cacheData
        this.lastCacheUpdate = Date.now()
        console.log(`Saved ${this.cache.size} translations to cache`)
      }
    } catch (error) {
      console.error('Failed to save translation cache:', error)
    }
  }

  // Check if cache needs refresh (older than 1 hour)
  private shouldRefreshCache(): boolean {
    const now = Date.now()
    return !this.isInitialized || (now - this.lastCacheUpdate) > this.CACHE_DURATION
  }

  // Background translation generation without blocking UI
  async initializeTranslations(productTitles: string[]): Promise<void> {
    // If cache is fresh, don't refresh
    if (!this.shouldRefreshCache()) {
      console.log('Translation cache is fresh, skipping refresh')
      return
    }

    console.log('Starting background translation refresh...')
    
    try {
      // Filter out already cached items that are still valid
      const uncachedTitles = productTitles.filter(title => 
        !this.cache.has(title.toLowerCase())
      )

      if (uncachedTitles.length === 0) {
        console.log('All products already have translations')
        this.isInitialized = true
        return
      }

      // Process in small batches to avoid rate limits
      const batchSize = 5
      const allTranslations: Record<string, string[]> = {}

      for (let i = 0; i < uncachedTitles.length; i += batchSize) {
        const batch = uncachedTitles.slice(i, i + batchSize)
        
        try {
          const batchTranslations = await this.generateTranslationsBatch(batch)
          Object.assign(allTranslations, batchTranslations)
          
          // Save partial progress
          Object.entries(batchTranslations).forEach(([key, value]) => {
            this.cache.set(key.toLowerCase(), value)
          })
          
          // Rate limiting
          if (i + batchSize < uncachedTitles.length) {
            await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY))
          }
        } catch (error) {
          console.error(`Failed to process batch ${i}-${i + batchSize}:`, error)
          // Add fallback translations for failed batch
          batch.forEach(title => {
            if (!this.cache.has(title.toLowerCase())) {
              this.cache.set(title.toLowerCase(), this.getFallbackTranslations(title))
            }
          })
        }
      }

      this.saveCacheToMemory()
      this.isInitialized = true
      console.log(`Background translation refresh completed. Total cached: ${this.cache.size}`)
      
    } catch (error) {
      console.error('Failed to initialize translations:', error)
      this.isInitialized = true // Still mark as initialized to avoid repeated attempts
    }
  }

  private async generateTranslationsBatch(productTitles: string[]): Promise<Record<string, string[]>> {
    try {
      const prompt = `Generate search keywords and translations for these Indian food items. Provide Hindi (Devanagari), Marathi (Devanagari), and English variations.

Food items: ${productTitles.join(', ')}

Return only valid JSON in this format:
{
  "item_name": ["hindi_translation", "marathi_translation", "english_variation", "common_nickname"],
  "another_item": ["translation1", "translation2", "variation1"]
}

Keep it concise - max 4-5 translations per item. Focus on commonly used terms.`

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides food name translations for Indian cuisine. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant", // Fast model for translations
        temperature: 0.1,
        max_tokens: 1000,
        top_p: 1,
        response_format: { type: "json_object" }
      })

      const responseText = completion.choices[0]?.message?.content
      if (!responseText) {
        throw new Error('Empty response from Groq')
      }

      const translations = JSON.parse(responseText)
      return translations
    } catch (error) {
      console.error('Groq API error:', error)
      // Return fallback translations
      const fallback: Record<string, string[]> = {}
      productTitles.forEach(title => {
        fallback[title] = this.getFallbackTranslations(title)
      })
      return fallback
    }
  }

  private getFallbackTranslations(title: string): string[] {
    const commonTranslations: Record<string, string[]> = {
      'pizza': ['पिज़्ज़ा', 'पीझा', 'pizza'],
      'burger': ['बर्गर', 'बरगर', 'burger'],
      'sandwich': ['सैंडविच', 'सँडविच', 'sandwich'],
      'biryani': ['बिरयानी', 'बिर्याणी', 'biriyani', 'dum biryani'],
      'dal': ['दाल', 'दाळ', 'lentils'],
      'rice': ['चावल', 'भात', 'तांदूळ', 'rice'],
      'chicken': ['चिकन', 'मुर्गी', 'कोंबडी', 'chicken'],
      'paneer': ['पनीर', 'पनिर', 'cottage cheese'],
      'dosa': ['डोसा', 'dose', 'दोसा'],
      'idli': ['इडली', 'idly'],
      'samosa': ['समोसा', 'समोसे'],
      'tea': ['चाय', 'chai', 'चहा'],
      'coffee': ['कॉफी', 'कॉफि', 'coffee'],
      'roti': ['रोटी', 'chapati', 'चपाती'],
      'naan': ['नान', 'nan'],
      'curry': ['करी', 'रस्सा', 'gravy'],
      'sweet': ['मिठाई', 'गोड', 'dessert', 'मिष्टान्न']
    }

    const lowerTitle = title.toLowerCase()
    
    // Find matching key
    for (const [key, translations] of Object.entries(commonTranslations)) {
      if (lowerTitle.includes(key) || key.includes(lowerTitle)) {
        return translations
      }
    }
    
    // If no match found, return the original title
    return [title]
  }

  getTranslationsForProduct(productTitle: string): string[] {
    const cached = this.cache.get(productTitle.toLowerCase())
    if (cached) {
      return [productTitle, ...cached]
    }
    return [productTitle]
  }

  getCacheSize(): number {
    return this.cache.size
  }

  isReady(): boolean {
    return this.isInitialized
  }

  getCacheAge(): number {
    return Date.now() - this.lastCacheUpdate
  }
}

// Initialize Groq service
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
let groqService: OptimizedGroqService | null = null

if (GROQ_API_KEY) {
  groqService = new OptimizedGroqService(GROQ_API_KEY)
}

// Function to sort products with pinned items first
const sortProductsByPinned = (products: Product[]): Product[] => {
  return products.sort((a, b) => {
    if ((a.pinned === "yes" && b.pinned === "yes") || (a.pinned !== "yes" && b.pinned !== "yes")) {
      return 0
    }
    if (a.pinned === "yes" && b.pinned !== "yes") {
      return -1
    }
    return 1
  })
}

// Enhanced search function using Groq translations
const searchProducts = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm.trim()) return sortProductsByPinned(products)
  
  const searchLower = searchTerm.toLowerCase()
  
  const filtered = products.filter((product) => {
    const productTitle = product.title.toLowerCase()
    const productDescription = product.description.toLowerCase()
    const productCategory = product.category?.toLowerCase() || ''
    
    // Basic search
    if (productTitle.includes(searchLower) || 
        productDescription.includes(searchLower) || 
        productCategory.includes(searchLower)) {
      return true
    }
    
    // If groqService is available and ready, use translations
    if (groqService && groqService.isReady()) {
      const translations = groqService.getTranslationsForProduct(product.title)
      return translations.some(translation =>
        translation.toLowerCase().includes(searchLower)
      )
    }
    
    return false
  })
  
  return sortProductsByPinned(filtered)
}

// Lazy loading product card component
const LazyProductCard: React.FC<{ product: Product; onClick: () => void; index: number }> = ({
  product,
  onClick,
  index,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const isPinned = product.pinned === "yes"
  
  return (
    <div ref={cardRef}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.03,
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
          whileHover={{ y: -8, scale: 1.02, zIndex: 10 }}
          whileTap={{ scale: 0.98 }}
          className="group cursor-pointer relative"
          style={{ zIndex: 1 }}
        >
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Card
                  className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card/50 backdrop-blur-sm relative ${
                    isPinned ? "ring-2 ring-primary/20 bg-primary/5" : ""
                  }`}
                  onClick={onClick}
                >
                  <div className="relative aspect-square overflow-hidden">
                    {isPinned && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge variant="default" className="gap-1 bg-primary/90 hover:bg-primary shadow-md">
                          <Pin className="w-3 h-3" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {product.photolink ? (
                      <div className="relative w-full h-full">
                        {!imageLoaded && (
                          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        <Image
                          src={product.photolink || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          onLoad={() => setImageLoaded(true)}
                          priority={index < 8}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Eye className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">No Image</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4 flex gap-2"
                    >
                      <Button size="sm" variant="secondary" className="flex-1 gap-2 bg-white/90 backdrop-blur-sm">
                        <Eye className="w-4 h-4" />
                        Quick View
                      </Button>
                    </motion.div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors ${
                          isPinned ? "text-primary" : ""
                        }`}>
                          {product.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-bold text-primary">{product.price}</span>
                        {product.category && (
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-xs p-4 bg-popover/95 backdrop-blur-sm border shadow-xl z-[100]"
                sideOffset={15}
              >
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {product.category && (
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    )}
                    {isPinned && (
                      <Badge variant="default" className="text-xs gap-1">
                        <Pin className="w-2 h-2" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      ) : (
        <div className="aspect-square bg-muted animate-pulse rounded-lg mb-6">
          <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 rounded-lg" />
        </div>
      )}
    </div>
  )
}

const ProductPopup: React.FC<PopupProps> = ({ product, isOpen, onClose }) => {
  const { theme } = useTheme()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-background border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square md:aspect-auto md:h-96">
                  {product.photolink ? (
                    <Image
                      src={product.photolink || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Eye className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <span className="text-muted-foreground">No Image Available</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold"
                      >
                        {product.title}
                      </motion.h2>
                      {product.pinned === "yes" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Badge variant="secondary" className="gap-1">
                            <Pin className="w-3 h-3" />
                            Featured
                          </Badge>
                        </motion.div>
                      )}
                    </div>

                    {product.category && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4"
                      >
                        <Badge variant="secondary" className="text-sm">
                          {product.category}
                        </Badge>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6"
                    >
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between pt-6 border-t"
                  >
                    <span className="text-3xl font-bold text-primary">{product.price}</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const LoadingCard = ({ index }: { index: number }) => (
  <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
      <CardContent className="p-6 space-y-3">
        <div className="h-6 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
      </CardContent>
    </Card>
  </motion.div>
)

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [retryCount, setRetryCount] = useState(0)
  const { theme } = useTheme()

  const fetchProducts = useCallback(async () => {
    console.time('Firebase Products Fetch')
    try {
      setError(null)
      const productsCollection = collection(db, "products")
      const productsSnapshot = await getDocs(productsCollection)
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]

      console.timeEnd('Firebase Products Fetch')
      console.log(`Fetched ${productsData.length} products`)

      const sortedProducts = sortProductsByPinned(productsData)
      setProducts(sortedProducts)
      setFilteredProducts(sortedProducts)
      setLoading(false)

      // Initialize translations silently in background
      if (sortedProducts.length > 0 && groqService) {
        const productTitles = [...new Set(sortedProducts.map(p => p.title))]
        
        // Fire and forget - don't await or show progress
        groqService.initializeTranslations(productTitles).catch(error => {
          console.error('Background translation initialization failed:', error)
        })
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again.")
      console.error("Error fetching products:", err)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const filtered = searchProducts(products, searchTerm)
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const openPopup = (product: Product) => {
    if (product.popupOkay === 'yes') {
      setSelectedProduct(product)
    }
  }

  const closePopup = () => {
    setSelectedProduct(null)
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setLoading(true)
    fetchProducts()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Loading Products</h2>
            <p className="text-muted-foreground">Fetching the latest delicious items...</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingCard key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRetry} size="lg" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
          {retryCount > 0 && (
            <p className="text-sm text-muted-foreground mt-3">
              Retry attempt: {retryCount}
            </p>
          )}
        </motion.div>
      </div>
    )
  }

  const pinnedCount = filteredProducts.filter(p => p.pinned === "yes").length
  const regularCount = filteredProducts.length - pinnedCount

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Rasoi
          </h1>
          <p className="text-xl text-muted-foreground tracking-tighter max-w-2xl mx-auto">
            Discover our amazing collection of dishes crafted with care and attention to detail
          </p>
          
          {/* Products count indicator */}
          {filteredProducts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4 mt-6 flex-wrap"
            >
              {pinnedCount > 0 && (
                <Badge variant="default" className="gap-1">
                  <Pin className="w-3 h-3" />
                  {pinnedCount} Featured
                </Badge>
              )}
              {regularCount > 0 && (
                <Badge variant="outline">
                  {regularCount} More Items
                </Badge>
              )}
              {groqService && groqService.isReady() && (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  Smart Search Ready ({groqService.getCacheSize()} items)
                </Badge>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={
                groqService && groqService.isReady()
                  ? "Search with AI translations (English, Hindi, Marathi)..." 
                  : "Search products..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12"
            />
            {groqService && groqService.isReady() && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? `No products match "${searchTerm}". Try different search terms${groqService && groqService.isReady() ? ' - AI translations are active!' : ''}` 
                : "No products available at the moment"
              }
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </motion.div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {filteredProducts.map((product, index) => (
              <LazyProductCard 
                key={product.id} 
                product={product} 
                onClick={() => openPopup(product)} 
                index={index} 
              />
            ))}
          </div>
        )}

        {/* Load More Button for Future Pagination */}
        {filteredProducts.length > 0 && !searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} products
              {groqService && groqService.isReady() && (
                <span className="ml-2">
                  • AI-powered search available
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>

      <ProductPopup product={selectedProduct!} isOpen={!!selectedProduct} onClose={closePopup} />
    </div>
  )
}

export default ProductsPage