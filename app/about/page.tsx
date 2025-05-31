import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Leaf, Award } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Passion for Quality",
    description: "We're passionate about creating high-quality t-shirts that you'll love to wear every day.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Our customers are at the heart of everything we do. Your satisfaction is our top priority.",
  },
  {
    icon: Leaf,
    title: "Sustainable Fashion",
    description: "We're committed to sustainable practices and eco-friendly materials in all our products.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every aspect of our business, from design to customer service.",
  },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Sarah founded TeeStyle with a vision to make high-quality, comfortable t-shirts accessible to everyone.",
  },
  {
    name: "Mike Chen",
    role: "Head of Design",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Mike brings over 10 years of fashion design experience to create our unique and trendy designs.",
  },
  {
    name: "Emily Davis",
    role: "Operations Manager",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Emily ensures that every order is processed efficiently and reaches our customers on time.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About TeeStyle</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We're a passionate team dedicated to creating the perfect t-shirt experience. From premium materials to
          innovative designs, we believe that comfort and style should never be compromised.
        </p>
      </section>

      {/* Story Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              TeeStyle was born from a simple idea: everyone deserves a perfect t-shirt. Founded in 2020, we started as
              a small team with big dreams and an unwavering commitment to quality.
            </p>
            <p>
              What began as a quest to find the perfect balance between comfort, style, and affordability has grown into
              a brand that thousands of customers trust for their everyday wardrobe essentials.
            </p>
            <p>
              Today, we continue to innovate and expand our collection while staying true to our core values of quality,
              sustainability, and customer satisfaction.
            </p>
          </div>
        </div>
        <div className="relative">
          <Image
            src="/placeholder.svg?height=500&width=600"
            alt="Our story"
            width={600}
            height={500}
            className="rounded-2xl shadow-xl"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To create high-quality, comfortable, and stylish t-shirts that empower people to express themselves
              confidently while promoting sustainable fashion practices.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To become the world's most trusted t-shirt brand, known for exceptional quality, innovative designs, and
              positive impact on both customers and the environment.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Team */}
  
    </div>
  )
}
