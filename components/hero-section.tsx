"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Instagram } from "lucide-react"
import Image from "next/image"
import { Star } from "lucide-react"
import Link from "next/link"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { app } from "@/lib/firebase"
import { useEffect, useState } from "react"

const firestore = getFirestore(app)

interface HeroData {
  heroImg: string
  heroText: string
  instaLink: string
}

export function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData>({
    heroImg: "https://res.cloudinary.com/dfgtpvpoh/image/upload/v1750432016/hero-bg_l5fqrz.png", // fallback
    heroText: "From Fresh produce to daily essentials, shop smarter", // fallback
    instaLink: "https://www.instagram.com/mona_s_kitchen07/" // fallback
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(firestore, "Home", "hero-section")
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setHeroData({
            heroImg: data["hero-img"] || heroData.heroImg,
            heroText: data["hero-text"] || heroData.heroText,
            instaLink: data["insta-link"] || heroData.instaLink
          })
        }
      } catch (error) {
        console.error("Error fetching hero data:", error)
        // Keep fallback values if there's an error
      } finally {
        setLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 -my-16 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Text Content */}
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                Loved by 1000+ customers with <Star className="ml-1 h-4 w-4 lg:mr-1 text-yellow-500" /> 4.9/5 rating
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-5xl">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                heroData.heroText.split(' ').map((word, index) => (
                  word.toLowerCase() === 'fresh' ? (
                    <span key={index} className="text-primary">{word} </span>
                  ) : (
                    <span key={index}>{word} </span>
                  )
                ))
              )}
            </h1>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={"/menu"}>
                <Button size="lg" className="w-full rounded-3xl sm:w-auto text-base px-8 py-3">
                  Check the menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href={heroData.instaLink} target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full rounded-3xl sm:w-auto text-base px-8 py-3 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                >
                  Follow us
                  <Instagram className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

          </div>

          {/* Image Content */}
          <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-16">
            <div className="relative rounded-xl bg-background/5 p-2 ring-1 ring-inset ring-foreground/10 lg:rounded-2xl lg:p-4">
              {loading ? (
                <div className="w-full h-[600px] bg-gray-200 animate-pulse rounded-md"></div>
              ) : (
                <Image
                  src={heroData.heroImg}
                  alt="Hero Section Image"
                  width={1000}
                  height={600}
                  className="rounded-md shadow-2xl ring-1 ring-foreground/10"
                  priority
                />
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/20 via-transparent to-transparent lg:rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
    </section>
  )
}