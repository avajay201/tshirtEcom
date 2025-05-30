"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, MapPin, CheckCircle, Search } from "lucide-react"

const trackingSteps = [
  {
    id: 1,
    title: "Order Confirmed",
    description: "Your order has been placed and confirmed",
    icon: Package,
    completed: true,
    date: "Jan 15, 2024 - 10:30 AM",
  },
  {
    id: 2,
    title: "Processing",
    description: "Your order is being prepared for shipment",
    icon: Package,
    completed: true,
    date: "Jan 15, 2024 - 2:15 PM",
  },
  {
    id: 3,
    title: "Shipped",
    description: "Your order has been shipped and is on its way",
    icon: Truck,
    completed: true,
    date: "Jan 16, 2024 - 9:00 AM",
  },
  {
    id: 4,
    title: "Out for Delivery",
    description: "Your order is out for delivery",
    icon: MapPin,
    completed: false,
    date: "Expected: Jan 18, 2024",
  },
  {
    id: 5,
    title: "Delivered",
    description: "Your order has been delivered",
    icon: CheckCircle,
    completed: false,
    date: "Expected: Jan 18, 2024 - 6:00 PM",
  },
]

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get("order") || "")
  const [isTracking, setIsTracking] = useState(!!searchParams.get("order"))

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId.trim()) {
      setIsTracking(true)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Track Your Order</h1>

      {!isTracking ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Enter Order ID</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your order ID (e.g., ORD-001)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="text-center"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Search className="w-4 h-4 mr-2" />
                Track Order
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order {orderId}</CardTitle>
                <Badge className="bg-blue-500">In Transit</Badge>
              </div>
              <p className="text-gray-600">Estimated delivery: January 18, 2024</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p className="text-gray-600">
                    John Doe
                    <br />
                    123 Main Street
                    <br />
                    Anytown, ST 12345
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tracking Number</h3>
                  <p className="text-gray-600 font-mono">1Z999AA1234567890</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : index === trackingSteps.findIndex((s) => !s.completed)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${step.completed ? "text-green-700" : "text-gray-900"}`}>
                            {step.title}
                          </h3>
                          {step.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <p className="text-gray-600 mb-1">{step.description}</p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-5 mt-10 w-0.5 h-6 ${
                            step.completed ? "bg-green-500" : "bg-gray-200"
                          }`}
                          style={{ marginLeft: "20px" }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => {
                setIsTracking(false)
                setOrderId("")
              }}
            >
              Track Another Order
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
