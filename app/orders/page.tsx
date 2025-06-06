"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderBadge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { myOrders } from "@/action/APIAction"
import { useEffect, useState } from "react"
import { LoaderOverlay } from "@/components/ui/LoaderOverlay"
import { motion, AnimatePresence } from "framer-motion"

// Mock orders data
// const orders = [
//   {
//     id: "ORD-001",
//     date: "2024-01-15",
//     status: "delivered",
//     total: 89.97,
//     items: [
//       {
//         id: 1,
//         name: "Classic White Tee",
//         price: 29.99,
//         quantity: 2,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//       {
//         id: 2,
//         name: "Vintage Graphic Tee",
//         price: 29.99,
//         quantity: 1,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//     ],
//   },
//   {
//     id: "ORD-002",
//     date: "2024-01-10",
//     status: "shipped",
//     total: 42.99,
//     items: [
//       {
//         id: 3,
//         name: "Premium Cotton Blend",
//         price: 42.99,
//         quantity: 1,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//     ],
//   },
//   {
//     id: "ORD-003",
//     date: "2024-01-05",
//     status: "processing",
//     total: 55.98,
//     items: [
//       {
//         id: 4,
//         name: "Minimalist Design Tee",
//         price: 27.99,
//         quantity: 2,
//         image: "/placeholder.svg?height=100&width=100",
//       },
//     ],
//   },
// ]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500"
    case "confirmed":
      return "bg-green-500"
    case "shipped":
      return "bg-blue-500"
    case "delivered":
      return "bg-green-500"
    case "failed":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null)

  const toggleOrder = (id) => {
    setOpenOrderId(prev => (prev === id ? null : id))
  }

  const fetchOrders = async () => {
    const result = await myOrders();
    setIsLoading(false)
    if (result) {
      setOrders(result)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (!user && !isLoading) {
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

  if (orders.length === 0 && !isLoading) {
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
    <>
      {isLoading && <LoaderOverlay />}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.order_id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">Order ID - {order.order_id}</CardTitle>
                    <p className="text-gray-600 flex items-center gap-3">Placed on 
                      <span className="font-bold">{order.created_at}</span>
                      <ChevronDown
                        className={`ml-2 transition-transform cursor-pointer ${openOrderId === order.order_id ? "rotate-180" : ""}`}
                        size={18}
                        onClick={() => toggleOrder(order.order_id)}
                        style={{margin: 0}}
                      />
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderBadge className={`${getStatusColor(order.status)} text-white capitalize`}>{order.status}</OrderBadge>
                    <span className="font-semibold text-lg">₹{order.total_price}</span>
                  </div>
                </div>
              </CardHeader>
              <AnimatePresence>
                {openOrderId === order.order_id && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent>
                      <div className="space-y-4">
                        {order.products.map((item, index) => (
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
                              <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            {index < order.products.length - 1 && <Separator className="mt-4" />}
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-between items-center border-t pt-4">
                        <p className="font-semibold text-gray-700">Shipping Charges</p>
                        <span className="font-semibold text-gray-900">₹{order.shipping_charges || '0.00'}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
                        {/* <Link href={`/track?order=${order.id}`}> */}
                        <Link href='#'>
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Package className="w-4 h-4 mr-2" />
                            Track Order
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
