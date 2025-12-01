import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChefHat, Heart, Users, Award, Clock, UtensilsCrossed } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
            <ChefHat className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-4">
            About Mona's Kitchen
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Crafting authentic flavors with love, one meal at a time. From traditional recipes to modern catering solutions.
          </p>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4 md:px-6">
        <div className="space-y-16">
          {/* Our Story */}
          <section className="bg-card p-8 md:p-12 rounded-lg shadow-md border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-primary" />
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2023, Mona's Kitchen emerged from a simple dream: to bring the warmth and authenticity of home-cooked meals to every family's table. What started as a small home-based kitchen has flourished into a trusted name in catering and daily meal services.
                  </p>
                  <p>
                    Our journey began when Mona, our founder and head chef, realized the need for convenient yet authentic home-style cooking. With generations of traditional recipes passed down and a passion for creating memorable culinary experiences, we set out to transform the way people experience food.
                  </p>
                  <p>
                    Today, we serve hundreds of families daily through our tiffin service, cater to special occasions, and offer custom meal solutions—all while maintaining the same dedication to quality, hygiene, and authentic flavors that started it all.
                  </p>
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <UtensilsCrossed className="w-32 h-32 text-primary/30" />
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Daily Tiffin Service</h3>
                <p className="text-muted-foreground">
                  Fresh, home-cooked meals delivered daily. Healthy, balanced, and made with love—perfect for busy families and working professionals.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Catering Services</h3>
                <p className="text-muted-foreground">
                  From intimate gatherings to grand celebrations. We cater events of all sizes with customized menus and impeccable service.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ChefHat className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Custom Orders</h3>
                <p className="text-muted-foreground">
                  Special dishes made to order. Whether it's a family favorite or a festive delicacy, we bring your cravings to life.
                </p>
              </div>
            </div>
          </section>

          {/* Meet the Team */}
          <section className="bg-card p-8 md:p-12 rounded-lg shadow-md border border-border">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-primary/20">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">MK</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-foreground mb-1">Mona</h3>
                <p className="text-muted-foreground mb-2">Founder & Head Chef</p>
                <p className="text-sm text-muted-foreground">
                  With over a decade of culinary expertise and a passion for traditional cooking, Mona brings authentic flavors to every dish.
                </p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <Award className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Authenticity</h3>
                <p className="text-muted-foreground">
                  We stay true to traditional recipes and time-honored cooking methods, preserving the rich flavors and cultural heritage of our cuisine.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <Heart className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Quality First</h3>
                <p className="text-muted-foreground">
                  Only the freshest ingredients make it to our kitchen. We source locally, cook with care, and serve with pride.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Building lasting relationships with our customers and local suppliers. Your satisfaction is our success story.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-8 md:p-12 rounded-lg border border-border">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Why Choose Mona's Kitchen?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Hygienic & Clean</h4>
                  <p className="text-sm text-muted-foreground">Our kitchen follows strict hygiene protocols to ensure every meal is safe and clean.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Fresh Daily</h4>
                  <p className="text-sm text-muted-foreground">No preservatives, no compromises. Every dish is prepared fresh daily using seasonal ingredients.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Affordable Pricing</h4>
                  <p className="text-sm text-muted-foreground">Quality food at reasonable prices. We believe good food should be accessible to everyone.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Customizable Menus</h4>
                  <p className="text-sm text-muted-foreground">We accommodate dietary preferences and restrictions. Your needs, our priority.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Timely Delivery</h4>
                  <p className="text-sm text-muted-foreground">Your meals arrive hot and fresh, right on time. Reliability you can count on.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Family Recipes</h4>
                  <p className="text-sm text-muted-foreground">Generations of culinary wisdom in every bite. Recipes passed down with love.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
