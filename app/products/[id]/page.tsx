"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, CreditCard, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { listProductDetails, productReviewSubmit } from "@/action/APIAction"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"


export default function ProductDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState({})
  const [reviews, setReviews] = useState([])
  const [varaintExists, setVariantExists] = useState(true)
  const [isBuy, setIsBuy] = useState(false);
  const { user } = useAuth()
  const [paramsApplied, setParamsApplied] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 1,
    comment: ''
  });
  const router = useRouter();

  const { addItem, removeItem: removeFromCart, isInCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    setTimeout(()=>{
      if (paramsApplied) return;
      const color = searchParams.get('color');
      const size = searchParams.get('size');
      if (color && size && Object.entries(product).length > 0){
        const applyToColor = product.colors.filter(clr => clr.name === color);
        if (product.sizes.includes(size) && applyToColor.length > 0){
          setSelectedSize(size);
          setSelectedColor(applyToColor[0]);
          const filterQuery = `?size=${size}&color=${color}`;
          fetchProductDetails(filterQuery);
          setParamsApplied(true)
        }
      }
    }, 100)
  }, [product]);

  const fetchProductDetails = async (filterQuery='') => {
    const result = await listProductDetails(params.id, filterQuery)
    if (result) {
      setVariantExists(true);
      setProduct(result)
      if (filterQuery === ''){
        setSelectedSize(result.sizes[0])
        setSelectedColor(result.colors[0])
      }
      setSelectedImage(0)
      setReviews(result.reviews || [])
    } else {
      console.log("Failed to fetch product details")
      if (filterQuery) {
        setVariantExists(false)
      }
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    if (isInCart(product.variant)) {
      removeFromCart(product.variant)
    } else {
      addItem({
        id: 0,
        variant: product.variant,
        product: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0].image,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor.name,
        stock: product.stock,
      })
    }
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0].image,
      })
    }
  }

  const handleVariantChange = (color_size='', type='') => {
    let filterQuery = ''
    if (type === 'color') {
      filterQuery = `?color=${color_size.name}&size=${selectedSize}`;
    }
    else if (type === 'size'){
      filterQuery = `?size=${color_size}&color=${selectedColor.name}`;
    }

    fetchProductDetails(filterQuery);

    if (type === 'color') {
      setSelectedColor(color_size);
    } else if (type === 'size') {
      setSelectedSize(color_size);
    }
  }

  const handleBuyNow = ()=>{
    if (!user){
      setIsBuy(true);
      return;
    }

    if (isInCart(product.variant)) {
      router.push('/checkout');
    }
    else{
      handleAddToCart();
      router.push('/checkout');
    }
  }

  if (!user && isBuy) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-24 w-24 mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Please sign in</h1>
        <p className="text-gray-600 mb-8">You need to be signed in to buy a product.</p>
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

  const handleReviewSubmit = async(e) => {
    e.preventDefault();
    setReviewError("");

    const reviewData = {
      ...newReview,
      product: product.id
    };

    const result = await productReviewSubmit(reviewData)
    if (result[0] === 201){
      setReviews([result[1].review, ...product.reviews]);
      setNewReview({ rating: 1, comment: '' });
      setReviewSuccess(result[1].message);
      setTimeout(()=>{
        setReviewSuccess("")
      }, 2000);
    }
    else{
      if (result[0] === 403) {
        setReviewError("You must be logged in to submit a review.");
      }
      else{
        setReviewError(result[1]);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images && product.images[selectedImage].image || "/placeholder.svg"}
              alt={product.name || 'Product Image'}
              width={600}
              height={600}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-custom">
            {product.images && product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === index ? "border-purple-500" : "border-gray-200"
                  }`}
              >
                <Image
                  src={image.image || "/placeholder.svg"}
                  alt={`${image.alt_text} ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            {/* <Badge className="mb-2">{product.category}</Badge> */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.average_rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews?.length} reviews)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.offer_price}</span>
              <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
              <Badge className="">Save {product.offer_percentage}%</Badge>
            </div>
          </div>

          <Separator />

          {!varaintExists && (
            <p style={{ color: 'red' }}>
              Selected variant is currently unavailable.
            </p>
          )}

          {/* Color Selection */}
          <div>
            <h3 className="font-medium mb-3">Color: {selectedColor.name}</h3>
            <div className="flex gap-2">
              {product.colors && product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleVariantChange(color, 'color')}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor.name === color.name
                      ? "border-purple-500 scale-110"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-medium mb-3">Size</h3>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes && product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleVariantChange(size, 'size')}
                  className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${selectedSize === size
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-medium mb-3">Quantity</h3>
            <div className="flex items-center gap-3 border-purple-500">
              <Button
                variant="outline"
                size="icon"
                className="border active:border-purple-500"
                onClick={() => setQuantity(Math.max(1, quantity - 1))
                }
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button variant="outline"
                className="border active:border-purple-500"
                disabled={!varaintExists}
                size="icon" onClick={() => {quantity < product.stock && varaintExists && setQuantity(quantity + 1);}}>
                <Plus className="h-4 w-4" />
              </Button>
              {quantity >= product.stock && (
                <p style={{ color: 'red' }}>
                  Maximum stock limit reached ({product.stock})
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => varaintExists && handleBuyNow()}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              size="lg"
              disabled={!varaintExists}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Buy Now
            </Button>
            <Button
              onClick={()=> varaintExists && handleAddToCart()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              size="lg"
              disabled={!varaintExists}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isInCart(product.variant) ? "Remove from Cart" : "Add to Cart"}
            </Button>
            <Button variant="outline" disabled={!varaintExists} onClick={()=> varaintExists && handleWishlistToggle()} className="w-full" size="lg">
              <Heart className={`w-5 h-5 mr-2 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
              {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over ₹500</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium">Sorry</p>
              <p className="text-xs text-gray-500">No return policy</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium">Quality Guarantee</p>
              <p className="text-xs text-gray-500">Premium materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews ? product.reviews.length : 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {product.description ? <p className="text-gray-700 leading-relaxed">{product.description}</p> : <p className="text-gray-500 text-center">No description available.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {product.features?.length > 0 ? <ul className="space-y-2">
                  {product.features && product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                  :
                  <p className="text-gray-500 text-center">No features available.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {reviews?.length > 0 ? reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{review.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.created_at}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
                :
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-center">No reviews yet.</p>
                  </CardContent>
                </Card>
              }

              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-medium mb-4">Add Your Review</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <Star
                          key={val}
                          onClick={() => setNewReview({ ...newReview, rating: val })}
                          className={`h-6 w-6 cursor-pointer transition ${
                            val <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Your Comment"
                      className="w-full p-2 border rounded"
                      rows="4"
                    />
                    {reviewError && (
                      <div className="text-red-500 text-sm">
                        {reviewError}
                      </div>
                    )}
                    {reviewSuccess && (
                      <div className="text-green-500 text-sm">
                        {reviewSuccess}
                      </div>
                    )}
                    <button type="submit" style={{background: "#111827"}} className="text-white px-4 py-2 rounded">
                      Submit Review
                    </button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
