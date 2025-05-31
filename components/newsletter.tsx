"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16" style = {{ marginTop : '2px' }}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <Mail className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay in Style</h2>
          <p className="text-lg text-purple-100 mb-8">
            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and style
            tips.
          </p>

          {isSubscribed ? (
            <div className="bg-white/20 backdrop-blur rounded-lg p-6 max-w-md mx-auto">
              <Check className="h-12 w-12 text-white mx-auto mb-4" />
              <p className="text-white font-semibold">Thank you for subscribing!</p>
              <p className="text-purple-100 text-sm">You'll receive our latest updates soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/20 backdrop-blur border-white/30 text-white placeholder:text-purple-200"
                required
              />
              <Button type="submit" className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8">
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-purple-200 text-sm mt-4">No spam, unsubscribe at any time. We respect your privacy.</p>
        </div>
      </div>
    </section>
  )
}
