'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

export function Header() {
  const navItems = [
    { label: 'ទំព័រដើម', href: '#home' },
    { label: 'មុខទំនិញ', href: '#products' },
    { label: 'រូបភាព', href: '#images' },
    { label: 'ទំនាក់ទំនង', href: '#contact' },
    { label: 'អំពីយើង', href: '#about' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center space-x-1 group cursor-pointer"
          >
            <span className="text-2xl md:text-3xl font-bold relative">
              <span
                className="text-pink-500 fill-pink-500"
                style={{
                  fontFamily: 'cursive, "Brush Script MT", "Lucida Handwriting"',
                  WebkitTextStroke: '1px #ec4899',
                  textShadow: '0 0 2px rgba(236, 72, 153, 0.3)',
                }}
              >
                phkasl
              </span>
              <span className="relative inline-block">
                <span
                  className="text-pink-500 fill-pink-500"
                  style={{
                    fontFamily: 'cursive, "Brush Script MT", "Lucida Handwriting"',
                    WebkitTextStroke: '1px #ec4899',
                    textShadow: '0 0 2px rgba(236, 72, 153, 0.3)',
                  }}
                >
                  a
                </span>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-pink-500 text-xs leading-none">
                  ♥
                </span>
              </span>
            </span>
          </a>

          {/* Navigation Links - Hidden on mobile, shown on desktop */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-black hover:text-pink-500 transition-colors duration-200 text-sm lg:text-base font-medium cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Login Button */}
            <Button
              variant="outline"
              className="hidden sm:flex bg-white border-red-500 text-black hover:bg-red-50 rounded-lg px-4 py-2"
              asChild
            >
              <Link href={ROUTES.LOGIN}>ចូលប្រើ</Link>
            </Button>

            {/* Member Button */}
            <Button
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2"
              asChild
            >
              <Link href={ROUTES.REGISTER}>សមាជិក</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
