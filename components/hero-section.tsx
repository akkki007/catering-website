import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"
import { Star } from "lucide-react"
export function HeroSection() {
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

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-6xl">
              From <span className="text-primary">Fresh</span> produce to daily essentials, shop smarter
            </h1>

            

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-3">
                Check the menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

          </div>

          {/* Image Content */}
          <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-16">
            <div className="relative rounded-xl bg-background/5 p-2 ring-1 ring-inset ring-foreground/10 lg:rounded-2xl lg:p-4">
              <Image
                src="/hero-bg.png"
                alt="SaaS Dashboard Preview"
                width={1000}
                height={600}
                className="rounded-md shadow-2xl ring-1 ring-foreground/10"
                priority
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/20 via-transparent to-transparent lg:rounded-2xl"></div>
            </div>
          </div>

          {/* Stats or Social Proof */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
            <p className="text-center text-sm font-semibold leading-6 text-muted-foreground">
              Trusted by over 10,000+ companies worldwide
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-8 gap-y-4 flex-wrap">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="h-8 w-24 bg-muted rounded opacity-60"></div>
                </div>
              ))}
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
