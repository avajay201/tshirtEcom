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
    <></>

  )
}
