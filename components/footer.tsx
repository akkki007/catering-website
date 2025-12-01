"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Phone, Mail, MapPin, Facebook, Twitter } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo.png" 
                alt="Mona's Kitchen Logo" 
                width={48} 
                height={48} 
                className="h-12 w-12"
              />
              <div>
                <h3 className="text-lg font-bold text-foreground">Mona's Kitchen</h3>
                <p className="text-sm text-muted-foreground">Authentic Home Cooking</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bringing you the finest home-cooked meals with love and care. Fresh, healthy, and delicious food for your family.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/menu" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link 
                  href="/rasoi" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Our Specialities
                </Link>
              </li>
              <li>
                <Link 
                  href="/trending" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/menu" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Daily Tiffin Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/rasoi" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Catering
                </Link>
              </li>
              <li>
                <Link 
                  href="/trending" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Special Items
                </Link>
              </li>
              <li>
                <Link 
                  href="/menu" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:+919403580287" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>+91 94035 80287</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:github.monaskitchen@gmail.com" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>github.monaskitchen@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Kothrud, Pune</span>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="pt-2">
              <h5 className="text-sm font-medium text-foreground mb-3">Follow Us</h5>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/mona_s_kitchen07/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="pb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Mona's Kitchen. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link 
              href="#" 
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

