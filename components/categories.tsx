import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: 1,
    name: "Men's Tees",
    image: "/placeholder.svg?height=300&width=300",
    href: "/products?category=men",
  },
  {
    id: 2,
    name: "Women's Tees",
    image: "/placeholder.svg?height=300&width=300",
    href: "/products?category=women",
  },
  {
    id: 3,
    name: "Kids Collection",
    image: "/placeholder.svg?height=300&width=300",
    href: "/products?category=kids",
  },
  {
    id: 4,
    name: "Trending Now",
    image: "/placeholder.svg?height=300&width=300",
    href: "/products?category=trending",
  },
]

export function Categories() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our carefully curated collections designed for every style and occasion
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={category.href}>
            <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={300}
                    height={300}
                    className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
