"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  const handleMoveToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: "M",
      color: "Default",
    })
    removeItem(item.id)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
        <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later.</p>
        <Link href="/products">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Start Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <Button variant="outline" onClick={clearWishlist}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <Link href={`/products/${item.id}`}>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-xl font-bold text-gray-900 mb-4">${item.price}</p>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Move to Cart
                  </Button>
                  <Link href={`/products/${item.id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
