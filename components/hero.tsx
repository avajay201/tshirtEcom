"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {listBanners} from  "./../action/APIAction"

// const banners = [
//   { id: 1, image: "https://cdn.shopify.com/s/files/1/1982/7331/files/1440_550_copy_3.png?v=1742922059" },
//   { id: 2, image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/category/catban-820250526190515.jpg" },
//   { id: 3, image: "https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/home_page_banner_OJbJx7t.jpg" },
// ]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [banners, setBanners] = useState([])
  
  const fetchBanners = async() => {
    const result = await listBanners()
    if (result){
      setBanners(result)
    }
  }

  useEffect (()=>{
    fetchBanners()
  },[])

  useEffect(() => {
    if (!banners) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <section className="relative h-[30vh] sm:h-[45vh] md:h-[65vh] overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50">


      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((slide,index) => (
          <div key={index} className="w-full flex-shrink-0 relative flex justify-center items-center">
            <Image
              src={slide?.image}
              alt={`Slide ${index + 1}`}
              fill
              className="rounded-xl shadow-xl object-contain max-h-full"
            />
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

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
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
