'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )

      // Animate title
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
      )

      // Animate subtitle
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
      )

      // Animate buttons
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' }
      )

      // Animate stats
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 1.1, ease: 'power3.out' }
      )

      // Animate image
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, delay: 0.6, ease: 'power3.out' }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20 pb-12 md:pb-16 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
    
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            {/* Header */}
            <p
              ref={headerRef}
              className="text-xs text-red-400 font-medium mb-2"
            >
              PHKASLA - ធៀបការឌីជីថល
            </p>

            {/* Main Title */}
            <h1
              ref={titleRef}
              className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 text-white leading-tight drop-shadow-lg"
            >
              ធៀបការបែបឌីជីថលក្នុងដៃអ្នក
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-xs md:text-sm text-gray-200 mb-5 max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-md"
            >
              កម្មវិធីគ្រប់គ្រងការរៀបចំពិធីមង្គលការដ៏ទំនើប ស្វែងរកភ្ញៀវ គ្រប់គ្រងចំណងដៃ បង្កើត លិខិតអញ្ជើញបែបឌីជីថល និងមានមុខងារពិសេសៗជាច្រើនទៀត។
            </p>

            {/* CTA Button */}
            <div ref={buttonsRef} className="mb-5">
              <Button
                size="lg"
                className="bg-linear-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-lg px-5 py-4 text-sm font-medium shadow-lg"
                asChild
              >
                <Link href={ROUTES.REGISTER}>ចាប់ផ្តើមឥឡូវនេះ</Link>
              </Button>
            </div>

            {/* Statistics */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-3 md:gap-4 max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center lg:text-left">
                <div className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow-md">
                  ២០០០+
                </div>
                <div className="text-xs text-gray-200">គូរស្នេហ៍</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow-md">
                  ២៤/៧
                </div>
                <div className="text-xs text-gray-200">ការគាំទ្រ</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow-md">
                  ៩៩%
                </div>
                <div className="text-xs text-gray-200">ការពេញចិត្ត</div>
              </div>
            </div>
          </div>

          {/* Right Side - Empty space or additional content */}
          <div ref={imageRef} className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] flex items-center justify-center">
            {/* This space can be used for additional content if needed */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
