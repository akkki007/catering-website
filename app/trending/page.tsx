"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CardCarousel } from "@/components/ui/card-carousel"

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
  discount: string
}

export default function Component() {
   const images = [
    { src: "/mjodak.png", alt: "Image 1" },
    { src: "/modak_dish.png", alt: "Image 2" },
    { src: "/tiffin.png", alt: "Image 3" },
  ]
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Trending"))
        const items: TrendingItem[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          items.push({
            id: doc.id,
            name: data.name,
            price: `₹${data.price}`,
            unit: data.unit,
            image: data.image || "/placeholder.svg?height=300&width=300",
            category: data.category,
            rating: data.rating,
            description: data.description,
            features: data.features || [],
            trending: data.trending || false,
            discount: `${data.discount}% OFF`,
          })
        })
        setTrendingItems(items)
      } catch (error) {
        console.error("Error fetching trending items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingItems()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Trending Items Carousel */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12 text-2xl tracking-tighter"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Trending
          </motion.div>

          
          <CardCarousel
          images={images}
          autoplayDelay={2000}
          showPagination={true}
          showNavigation={true}
          />
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-orange-500 to-amber-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Order Your Favorites?</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and experience the best catering service in town
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg">
                Browse Full Menu
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg bg-transparent"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now: +91 94035 80287
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
