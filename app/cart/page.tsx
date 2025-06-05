"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, Loader } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { LoaderOverlay } from "@/components/ui/LoaderOverlay"


export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart, isLoading } = useCart()
  const router = useRouter()

  if (items.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  const handleCheckout = ()=>{
    router.push("/checkout")
  }

  return (
    <>
      {isLoading && <LoaderOverlay/>}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.id}-${item.size}-${item.color}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Link href={`/products/${item.product}/?color=${item.color}&size=${item.size}`}>
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>
                    </Link>

                    <div className="flex-1">
                      <Link href={`/products/${item.product}/?color=${item.color}&size=${item.size}`}>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-gray-600">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-lg font-bold text-purple-600">₹{(item.quantity * item.price).toFixed(2)}</p>
                      </Link>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => item.quantity < item.stock && updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      {item.quantity >= item.stock && (
                        <p style={{ color: 'red' }}>
                          Maximum stock limit reached ({item.stock})
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.variant)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">Secure checkout powered by Stripe</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
