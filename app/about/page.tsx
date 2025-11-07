import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function AboutPage() {
  return (
    <div className="bg-gray-50/90">
      <main className="container mx-auto py-12 px-4 md:px-6">
        <div className="space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              About Mona's Kitchen
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Our mission is to share the authentic flavors of home-cooked meals with our community.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2023, Mona's Kitchen started as a small home-based kitchen with a passion for traditional recipes. We have since grown into a beloved local eatery, known for our commitment to quality and flavor.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">Mona</h3>
                <p className="text-gray-600">Founder & Head Chef</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Authenticity: Staying true to traditional recipes and cooking methods.</li>
              <li>Quality: Using only the freshest and highest-quality ingredients.</li>
              <li>Community: Building a strong connection with our customers and local suppliers.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}