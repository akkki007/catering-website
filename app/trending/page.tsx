"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Star, TrendingUp, Clock, Users, Award } from "lucide-react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import PointerHighlightDemo from "@/components/pointer-text"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface TrendingItem {
  id: string;
  name: string;
  price: string;
  unit: string;
  image: string;
  category: string;
  rating: number;
  description: string;
  features: string[];
  trending: boolean;
  discount: string;
}

export default function Component() {
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
            discount: `${data.discount}% OFF`
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
      <Navbar/>
      <PointerHighlightDemo/>
      
      {/* Trending Items */}
      <section className="py-16 px-4">
        <div className="container -my-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {trendingItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredCard(item.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* Discount Badge */}
                      <motion.div
                        className="absolute top-4 left-4 z-10"
                        animate={{
                          scale: hoveredCard === item.id ? 1.1 : 1,
                          rotate: hoveredCard === item.id ? 5 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1">{item.discount}</Badge>
                      </motion.div>

                      {/* Trending Badge */}
                      {item.trending && (
                        <motion.div
                          className="absolute top-4 right-4 z-10"
                          animate={{
                            scale: hoveredCard === item.id ? 1.1 : 1,
                            rotate: hoveredCard === item.id ? -5 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        </motion.div>
                      )}

                      {/* Image */}
                      <motion.div
                        className="relative h-64 bg-gradient-to-br from-orange-200 to-amber-200"
                        animate={{ scale: hoveredCard === item.id ? 1.05 : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                      </motion.div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge variant="outline" className="mb-2 text-orange-600 border-orange-200">
                            {item.category}
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600">{item.price}</div>
                          <div className="text-sm text-gray-500">{item.unit}</div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {item.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            className="text-xs text-gray-600 flex items-center"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2" />
                            {feature}
                          </motion.div>
                        ))}
                      </div>

                      {/* Rating and Orders */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1">{item.rating}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" size="lg">
                          Order Now
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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