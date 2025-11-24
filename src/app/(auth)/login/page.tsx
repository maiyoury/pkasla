'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const { login } = useAuth()

  // Auto-focus email input on mount
  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  // Email validation
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError(null)
    return true
  }

  // Password validation
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required')
      return false
    }
    if (value.length < 3) {
      setPasswordError('Password must be at least 3 characters')
      return false
    }
    setPasswordError(null)
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (emailError) {
      validateEmail(value)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (passwordError) {
      validatePassword(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate fields
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    
    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)
    setIsSubmitting(true)
    
    try {
      const result = await login({ email, password })
      if (!result.success) {
        setError(result.error || 'Login failed')
        setIsSubmitting(false)
      }
      // Login hook redirects: admin -> /admin, user -> /dashbord
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login')
      setIsSubmitting(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop')`
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col items-center justify-center w-full p-12 relative z-10">
          <div className="max-w-md text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white leading-tight drop-shadow-lg">
                Wedding Invitation Platform
              </h1>
              <p className="text-sm text-white/90 leading-relaxed drop-shadow-md">
                Create beautiful Cambodian wedding invitations and manage your events with ease
              </p>
            </div>
            
            {/* Feature Cards */}
            <div className="mt-10 grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 backdrop-blur-md rounded-lg border border-white/30 shadow-lg hover:shadow-xl transition-all">
                <p className="font-semibold text-white mb-1.5 drop-shadow-md">Event Management</p>
                <p className="text-white/90 text-[11px] drop-shadow-sm">Organize your wedding events</p>
              </div>
              <div className="p-4 backdrop-blur-md rounded-lg border border-white/30 shadow-lg hover:shadow-xl transition-all">
                <p className="font-semibold text-white mb-1.5 drop-shadow-md">Guest Tracking</p>
                <p className="text-white/90 text-[11px] drop-shadow-sm">Manage your guest list</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-4 py-8">
        <Card className="max-w-sm w-full border border-gray-200 shadow-sm">
          <CardHeader className="pb-4 space-y-1">
            <CardTitle className="text-xl text-center text-black">Welcome Back</CardTitle>
            <CardDescription className="text-xs text-center text-gray-500">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-black">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  placeholder="email@example.com"
                  className={cn(
                    "h-9 text-xs border-gray-200 pl-8",
                    emailError && "border-red-300 focus-visible:ring-red-200"
                  )}
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-xs text-red-600 mt-0.5">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs text-black">
                  Password
                </Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-gray-600 hover:text-black hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  placeholder="Enter your password"
                  className={cn(
                    "h-9 text-xs border-gray-200 pl-8 pr-9",
                    passwordError && "border-red-300 focus-visible:ring-red-200"
                  )}
                  required
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-xs text-red-600 mt-0.5">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label
                htmlFor="remember"
                className="text-xs text-gray-600 cursor-pointer font-normal"
              >
                Remember me
              </Label>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2.5 animate-in fade-in-0"
                role="alert"
              >
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full h-9 text-xs bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-5 text-center text-xs">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link 
              href="/register" 
              className="text-black hover:underline font-medium transition-colors"
            >
              Create account
            </Link>
          </div>

          {/* Test Accounts (Collapsible) */}
          <details className="mt-5 pt-4 border-t border-gray-200">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 list-none">
              <span className="select-none">Test Accounts</span>
            </summary>
            <div className="mt-3 text-xs text-gray-600 space-y-2">
              <div className="p-2 bg-gray-50 rounded border border-gray-100">
                <p className="font-medium text-gray-700 mb-1">Admin Accounts:</p>
                <p className="font-mono text-[10px]">admin@pkasla.com / admin123</p>
                <p className="font-mono text-[10px] mt-1">demo@pkasla.com / demo123</p>
              </div>
              <div className="p-2 bg-gray-50 rounded border border-gray-100">
                <p className="font-medium text-gray-700 mb-1">User Account:</p>
                <p className="font-mono text-[10px]">sarah.smith@example.com / password123</p>
              </div>
            </div>
          </details>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}
