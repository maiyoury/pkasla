'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Header } from '@/components/landings/index'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

function Landing() {
  

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 via-white to-amber-50">
      <Header />
    </div>
  )
}

export default Landing
