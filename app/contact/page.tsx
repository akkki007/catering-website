import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="bg-gray-50/90">
      <main className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Contact Us
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                We'd love to hear from you. Here's how you can reach us.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Business Hours</h2>
                <p className="text-gray-600">Monday - Friday: 9 AM - 5 PM</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
                <p className="text-gray-600">Email: info@monaskitchen.com</p>
                <p className="text-gray-600">Phone: (123) 456-7890</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Follow Us</h2>
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="text-gray-600 hover:text-gray-900">Facebook</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Instagram</a>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div>
                <Label htmlFor="email" className="text-lg">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div>
                <Label htmlFor="subject" className="text-lg">Subject</Label>
                <Input id="subject" placeholder="Enter the subject" />
              </div>
              <div>
                <Label htmlFor="message" className="text-lg">Message</Label>
                <Textarea id="message" placeholder="Enter your message" className="min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full text-lg">Send Message</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}