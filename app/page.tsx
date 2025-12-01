import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import Services from "@/components/Services"
import ModernOffersPopup from "@/components/Popup"
export default function Home() {
  return (
    <>
    <ModernOffersPopup />
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <Services/>
    </div>
    </>
  )
}
