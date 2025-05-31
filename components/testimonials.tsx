"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Amazing quality t-shirts! The fabric is so soft and comfortable. I've ordered multiple times and they never disappoint.",
    product: "Classic White Tee",
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Fast shipping and excellent customer service. The designs are unique and the fit is perfect. Highly recommended!",
    product: "Vintage Graphic Tee",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Love the sustainable approach and eco-friendly materials. These tees are not just stylish but also environmentally conscious.",
    product: "Premium Cotton Blend",
  },
]

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])


}
