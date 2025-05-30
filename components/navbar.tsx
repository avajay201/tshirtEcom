"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, ShoppingCart, Heart, User } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user, logout } = useAuth()

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div style={{padding: '0 18px'}} className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-xl font-bold">TeeStyle</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{cartItemsCount}</Badge>
              )}
            </Button>
          </Link>
          {user ? (
            <div className="flex items-center space-x-2">
              <Link href="/orders">
                <Button variant="ghost" size="sm">
                  My Orders
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center space-x-4 pt-4">
                <Link href="/wishlist" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="relative">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                    {wishlistItems.length > 0 && <Badge className="ml-2">{wishlistItems.length}</Badge>}
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {cartItemsCount > 0 && <Badge className="ml-2">{cartItemsCount}</Badge>}
                  </Button>
                </Link>
              </div>
              {user ? (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link href="/orders" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      My Orders
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
