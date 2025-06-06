"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { listHomeProducts } from "@/action/APIAction"
import { LoaderOverlay } from "./ui/LoaderOverlay"


export function FeaturedProducts() {
  const { addItem, isInCart, removeItem: removeFromCart } = useCart()
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = async () => {
    setIsLoading(true);
    const result = await listHomeProducts();
    setIsLoading(false);
    if (result) {
      setFeaturedProducts(result.featured_products || []);
      setRecommendedProducts(result.recommended_products || []);
    }
  };

  useEffect(() => {
    fetchProducts()
  }, []);

  const handleAddToCart = (product: any) => {
    if (isInCart(product.variant)) {
      removeFromCart(product.variant)
    }
    else{
      addItem({
        id: 0,
        variant: product.variant,
        product: product.id,
        name: product.name,
        price: product.offer_price,
        image: product.images[0].image,
        quantity: 1,
        size: product.sizes[0],
        color: product.colors[0].name,
        stock: product.stock,
      })
    }
  }

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0].image,
      };
      addToWishlist(newItem);
    }
  }

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  return (
    <>
    {isLoading && <LoaderOverlay/>}

    {featuredProducts.length > 0 && 
      <section className="container mx-auto px-4 py-6 md:py-12" style={{ marginTop: '2px' }}>
        <div className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Handpicked favorites that our customers love most</p>
        </div>

        {isLoading && <div className="flex justify-center items-center my-4">
          <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
        </div>
        }
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id + '-' + generateRandomString()}
                className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredProduct(product.variant)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.images[0].image || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>

                    {/* Badges */}
                    {/* <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                    {product.isSale && <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>}
                  </div> */}

                    {/* Action Buttons */}
                    <div
                      className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${hoveredProduct === product.variant ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                        }`}
                    >
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                        onClick={() => handleWishlistToggle(product)}
                      >
                        <Heart
                          className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white relative"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 text-gray-600" />
                        {isInCart(product.variant) && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                            1
                          </span>
                        )}
                      </Button>
                    </div>

                    {/* Quick Add to Cart */}
                    {/* <div
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
                  </div> */}
                  </div>

                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* <div className="flex items-center gap-1 mb-2">
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
                  </div> */}

                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">₹{product.offer_price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                      <Badge className="">Save {product.offer_percentage}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="hover:bg-purple-50 hover:border-purple-300">
                View All Products
              </Button>
            </Link>
          </div>
      </section>
    }

    {
      recommendedProducts.length === 0 && featuredProducts.length === 0 && 
      <div style={{margin: "50px 0"}} className="text-center">No products</div>
    }
    </>
  )

}

