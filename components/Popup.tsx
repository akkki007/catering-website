"use client"
import { useState, useEffect } from "react"
import { X, ShoppingCart, Phone, Star, Timer, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import Image from "next/image"

interface Offer {
  id: string
  title: string
  desc: string
  price: string
  discount?: number
  img: string
  theme?: "orange" | "blue" | "green" | "purple" | "red"
}

const themeColors = {
  orange: {
    bg: "bg-orange-500",
    hover: "hover:bg-orange-600",
    border: "border-orange-500",
    text: "text-orange-500",
    gradient: "from-orange-400 to-orange-600",
  },
  blue: {
    bg: "bg-blue-500",
    hover: "hover:bg-blue-600",
    border: "border-blue-500",
    text: "text-blue-500",
    gradient: "from-blue-400 to-blue-600",
  },
  green: {
    bg: "bg-green-500",
    hover: "hover:bg-green-600",
    border: "border-green-500",
    text: "text-green-500",
    gradient: "from-green-400 to-green-600",
  },
  purple: {
    bg: "bg-purple-500",
    hover: "hover:bg-purple-600",
    border: "border-purple-500",
    text: "text-purple-500",
    gradient: "from-purple-400 to-purple-600",
  },
  red: {
    bg: "bg-red-500",
    hover: "hover:bg-red-600",
    border: "border-red-500",
    text: "text-red-500",
    gradient: "from-red-400 to-red-600",
  },
}

export default function ModernOffersPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentOffer, setCurrentOffer] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes countdown
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch only the fields you have in Firestore
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Ads'))
        const fetchedOffers: Offer[] = []
        
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          fetchedOffers.push({
            id: doc.id,
            title: data.title || "Special Offer",
            desc: data.desc || "",
            price: data.price || "$0.00",
            discount: data.discount,
            img: data.img || "🛒",
            theme: data.theme || "orange"
          })
        })

        setOffers(fetchedOffers)
      } catch (error) {
        console.error("Error fetching offers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  // Auto-show popup after 2 seconds if offers exist
  useEffect(() => {
    if (offers.length > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [offers])

  // Auto-rotate offers every 6 seconds when popup is open
  useEffect(() => {
    if (isVisible && offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOffer((prev) => (prev + 1) % offers.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [isVisible, offers])

  // Countdown timer
  useEffect(() => {
    if (isVisible && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isVisible, timeLeft])

  const closePopup = () => {
    setIsVisible(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isVisible || loading || offers.length === 0) return null

  const offer = offers[currentOffer]
  const theme = themeColors[offer.theme || "orange"]

  // Default values for UI elements not in your Firestore
  const originalPrice = offer.price ? `$${(parseFloat(offer.price.replace('$', '')) * 1.3).toFixed(2)}` : "$0.00"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl animate-in slide-in-from-bottom-8 duration-500 overflow-hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={closePopup}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header with Gradient */}
        <div className={`relative bg-gradient-to-br ${theme.gradient} p-6 text-white overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>

         

          {/* Product Image/Emoji */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm">
              <Image
                src={offer.img}
                alt={offer.title}
                width={80}
                height={80}
                className="object-cover rounded-full"/>
            </div>
          </div>

          {/* Title and Rating - Rating is default since not in your Firestore */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2 leading-tight">{offer.title}</h3>

            <div className="flex items-center justify-center gap-1 mb-3">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span className="text-xs opacity-80">(2.1k reviews)</span>
            </div>

            {/* Price Section */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold">{offer.price}</span>
              <span className="text-sm line-through opacity-70">{originalPrice}</span>
            </div>

            {offer.discount && (
              <Badge className="bg-white text-green-600 hover:bg-white/90 font-bold">
                <Gift className="w-3 h-3 mr-1" />
                Save {offer.discount}%
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed text-center">{offer.desc}</p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className={`w-full ${theme.bg} ${theme.hover} text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Order Now - {offer.price}
            </Button>

            <Button
              variant="outline"
              className={`w-full ${theme.border} ${theme.text} hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all duration-300`}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call to Order
            </Button>
          </div>

          {/* Pagination Dots */}
          {offers.length > 1 && (
            <div className="flex justify-center space-x-2 pt-2">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentOffer(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentOffer ? `${theme.bg} scale-125` : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Trust Indicators - Default UI elements */}
          <div className="flex justify-center items-center gap-4 pt-2 text-xs text-gray-500">
            <span>✓ Free Shipping</span>
            <span>✓ 30-Day Return</span>
            <span>✓ Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  )
}