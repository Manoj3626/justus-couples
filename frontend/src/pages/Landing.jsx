import React from 'react'
import NavBar from '../components/NavBar'
import HeroLanding from '../components/HeroLanding'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorksSection from '../components/HowItWorksSection'
import ExperienceSection from '../components/ExperienceSection'
import PrivacyLandingSection from '../components/PrivacyLandingSection'
import FAQ from '../components/FAQ'
import FinalCTASection from '../components/FinalCTASection'
import Footer from '../components/Footer'
import FloatingHeartWave from '../components/FloatingHeartWave'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#2B2025] font-sans antialiased selection:bg-[#F7DDE4] selection:text-[#9E3155] relative">
      {/* Wave animation of red hearts starting from bottom-left corner moving upward */}
      <FloatingHeartWave />

      {/* Top Header Navigation */}
      <NavBar />

      <main>
        {/* 1. Home / Hero */}
        <HeroLanding />

        {/* 2. Features */}
        <FeaturesSection />

        {/* 3. How It Works */}
        <HowItWorksSection />

        {/* 4. Experience */}
        <ExperienceSection />

        {/* 5. Privacy */}
        <PrivacyLandingSection />

        {/* 6. FAQ */}
        <FAQ />

        {/* Final CTA Banner */}
        <FinalCTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

