import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { HandbookExploreSection } from "@/components/handbook-explore-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <HandbookExploreSection />
      <Footer />
    </div>
  )
}
