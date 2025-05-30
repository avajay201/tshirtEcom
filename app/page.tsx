import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"
import { Testimonials } from "@/components/testimonials"
import { Newsletter } from "@/components/newsletter"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <Categories />
      <FeaturedProducts />
      {/* <Testimonials /> */}
      <Newsletter />
    </div>
  )
}
