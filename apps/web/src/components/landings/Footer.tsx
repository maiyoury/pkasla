'use client'

import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 300px
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <footer className="bg-transparent absolute bottom-0 left-0 right-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            {/* Copyright Text */}
            <p className="text-sm text-white text-center">
              © Copyright 2024 ~ {new Date().getFullYear()} - Powered by Phkasla
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button - Floating Overlay */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          variant="outline"
          size="icon"
          className="fixed bottom-8 right-8 z-50 rounded-full border-gray-300 hover:bg-gray-100 bg-white shadow-lg backdrop-blur-xl transition-all duration-300"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}

export default Footer
