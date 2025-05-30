"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Heart, ShoppingCart, Star, Filter } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

const products = [
  {
    id: 1,
    name: "Classic White Tee",
    price: 29.99,
    originalPrice: 39.99,
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.8,
    reviews: 124,
    category: "men",
    color: "white",
    size: ["XS", "S", "M", "L", "XL"],
    isNew: false,
    isSale: true,
  },
  {
    id: 2,
    name: "Vintage Graphic Tee",
    price: 34.99,
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.9,
    reviews: 89,
    category: "women",
    color: "black",
    size: ["S", "M", "L", "XL"],
    isNew: true,
    isSale: false,
  },
  {
    id: 3,
    name: "Premium Cotton Blend",
    price: 42.99,
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.7,
    reviews: 156,
    category: "men",
    color: "blue",
    size: ["M", "L", "XL", "XXL"],
    isNew: false,
    isSale: false,
  },
  {
    id: 4,
    name: "Kids Fun Design",
    price: 19.99,
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.6,
    reviews: 67,
    category: "kids",
    color: "red",
    size: ["XS", "S", "M"],
    isNew: true,
    isSale: false,
  },
  {
    id: 5,
    name: "Minimalist Design Tee",
    price: 27.99,
    originalPrice: 35.99,
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.6,
    reviews: 98,
    category: "women",
    color: "gray",
    size: ["XS", "S", "M", "L"],
    isNew: false,
    isSale: true,
  },
  {
    id: 6,
    name: "Trending Streetwear",
    price: 38.99,
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.5,
    reviews: 203,
    category: "trending",
    color: "black",
    size: ["S", "M", "L", "XL"],
    isNew: false,
    isSale: false,
  },
]

const categories = ["men", "women", "kids", "trending"]
const colors = ["white", "black", "blue", "red", "gray"]
const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [sortBy, setSortBy] = useState("featured")
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false
        if (selectedColors.length > 0 && !selectedColors.includes(product.color)) return false
        if (selectedSizes.length > 0 && !product.size.some((size) => selectedSizes.includes(size))) return false
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false
        return true
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "newest":
            return b.isNew ? 1 : -1
          case "rating":
            return b.rating - a.rating
          default:
            return 0
        }
      })
  }, [selectedCategories, selectedColors, selectedSizes, priceRange, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    }
  }

  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors((prev) => [...prev, color])
    } else {
      setSelectedColors((prev) => prev.filter((c) => c !== color))
    }
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes((prev) => [...prev, size])
    } else {
      setSelectedSizes((prev) => prev.filter((s) => s !== size))
    }
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: "M",
      color: product.color,
    })
  }

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Filters</h2>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <Label htmlFor={category} className="capitalize cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-medium mb-3">Colors</h3>
              <div className="space-y-2">
                {colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={color}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                    />
                    <Label htmlFor={color} className="capitalize cursor-pointer">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-medium mb-3">Sizes</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={size}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                    />
                    <Label htmlFor={size} className="cursor-pointer text-sm">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-3">
                <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={5} className="w-full" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">All Products</h1>
              <p className="text-gray-600">{filteredProducts.length} products found</p>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                      {product.isSale && <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>}
                    </div>

                    {/* Action Buttons */}
                    <div
                      className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                        hoveredProduct === product.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                      }`}
                    >
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                        onClick={() => handleWishlistToggle(product)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                          }`}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>

                    {/* Quick Add to Cart */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${
                        hoveredProduct === product.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      <Button
                        className="w-full bg-white text-black hover:bg-gray-100"
                        onClick={() => handleAddToCart(product)}
                      >
                        Quick Add to Cart
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedCategories([])
                  setSelectedColors([])
                  setSelectedSizes([])
                  setPriceRange([0, 100])
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
