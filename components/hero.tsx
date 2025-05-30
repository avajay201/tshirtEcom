"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    title: "Summer Collection 2024",
    subtitle: "Discover our latest trendy t-shirts",
    image: "/placeholder.svg?height=600&width=800",
    cta: "Shop Now",
  },
  {
    id: 2,
    title: "Premium Quality Tees",
    subtitle: "Comfort meets style in every thread",
    image: "/placeholder.svg?height=600&width=800",
    cta: "Explore",
  },
  {
    id: 3,
    title: "Limited Edition Designs",
    subtitle: "Exclusive patterns you won't find anywhere else",
    image: "/placeholder.svg?height=600&width=800",
    cta: "Get Yours",
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50">
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroSlides.map((slide, index) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                <div className="space-y-6 text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">{slide.title}</h1>
                  <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto md:mx-0">{slide.subtitle}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Link href="/products">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200"
                      >
                        {slide.cta}
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="hover:bg-gray-50 transition-colors">
                      View Collection
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      width={600}
                      height={600}
                      className="rounded-2xl shadow-2xl"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl transform rotate-3 scale-95 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
