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

  return (
    <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our happy customers
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <Card className="mx-4 border-0 shadow-xl bg-white/80 backdrop-blur">
                    <CardContent className="p-8 text-center">
                      <Quote className="h-12 w-12 text-purple-400 mx-auto mb-6" />

                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      <p className="text-lg text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>

                      <div className="flex items-center justify-center space-x-4">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">Purchased: {testimonial.product}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial ? "bg-purple-500 scale-125" : "bg-purple-200 hover:bg-purple-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
