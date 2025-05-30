"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Eye, RotateCcw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

// Mock orders data
const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 89.97,
    items: [
      {
        id: 1,
        name: "Classic White Tee",
        price: 29.99,
        quantity: 2,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        name: "Vintage Graphic Tee",
        price: 29.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    total: 42.99,
    items: [
      {
        id: 3,
        name: "Premium Cotton Blend",
        price: 42.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    total: 55.98,
    items: [
      {
        id: 4,
        name: "Minimalist Design Tee",
        price: 27.99,
        quantity: 2,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500"
    case "shipped":
      return "bg-blue-500"
    case "processing":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export default function OrdersPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-24 w-24 mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Please sign in</h1>
        <p className="text-gray-600 mb-8">You need to be signed in to view your orders.</p>
        <Link href="/login">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Sign In
          </Button>
        </Link>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-24 w-24 mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h1>
        <p className="text-gray-600 mb-8">When you place your first order, it will appear here.</p>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Order {order.id}</CardTitle>
                  <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(order.status)} text-white capitalize`}>{order.status}</Badge>
                  <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {index < order.items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
                <Link href={`/track?order=${order.id}`}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Package className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                </Link>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {order.status === "delivered" && (
                  <Button variant="outline" className="w-full sm:w-auto">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Return Items
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
