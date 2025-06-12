import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1>
                  <span className="block text-sm font-semibold uppercase tracking-wide text-primary">
                    Welcome to the future
                  </span>
                  <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                    <span className="block text-foreground">Build amazing</span>
                    <span className="block text-primary">experiences</span>
                  </span>
                </h1>
                <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Create stunning websites and applications with our modern, responsive components. Perfect for
                  startups, agencies, and enterprises looking to make an impact.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button size="lg" className="flex items-center justify-center">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="lg" className="flex items-center justify-center">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Demo
                    </Button>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">Free 14-day trial. No credit card required.</p>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <div className="relative block w-full bg-background rounded-lg overflow-hidden">
                    <Image
                      className="w-full rounded-lg"
                      src="/placeholder.svg?height=400&width=600"
                      alt="Hero illustration"
                      width={600}
                      height={400}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/5 to-transparent"></div>
    </section>
  )
}
