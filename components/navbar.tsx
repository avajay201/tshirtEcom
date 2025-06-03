"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, ShoppingCart, Heart, User, X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const desktopFormRef = useRef<HTMLFormElement>(null);
  const desktopButtonRef = useRef<HTMLButtonElement>(null);

  // Consolidated click-outside handler for mobile and desktop search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Mobile search
      const mobileClickedOutside =
        formRef.current &&
        buttonRef.current &&
        !formRef.current.contains(target) &&
        !buttonRef.current.contains(target);

      // Desktop search
      const desktopClickedOutside =
        desktopFormRef.current &&
        desktopButtonRef.current &&
        !desktopFormRef.current.contains(target) &&
        !desktopButtonRef.current.contains(target);

      if (mobileClickedOutside && desktopClickedOutside) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofocus input for mobile search
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Autofocus input for desktop search
  useEffect(() => {
    if (isSearchOpen && desktopFormRef.current) {
      const input = desktopFormRef.current.querySelector("input");
      input?.focus();
    }
  }, [isSearchOpen]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setIsSearchOpen(false);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`).then(() => {
      setSearchTerm("");
      setIsSearchOpen(false);
    });
  };

  const cartItemsCount = items.length;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div style={{ padding: "0 18px" }} className="container flex h-16 items-center justify-between">
        {/* Logo and Mobile Nav */}
        <div className="flex items-center space-x-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden mr-4">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
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
                      {/* Wishlist */}
                      {wishlistItems.length > 0 && (
                        <Badge className="ml-2">{wishlistItems.length}</Badge>
                      )}
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="relative">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {/* Cart */}
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
                        logout();
                        setIsOpen(false);
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
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-xl font-bold">TeeStyle</span>
          </Link>
        </div>

        {/* Search toggle button - visible only on mobile */}
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSearchOpen((prev) => !prev)}
          aria-label={isSearchOpen ? "Close search" : "Open search"}
          aria-expanded={isSearchOpen}
        >
          {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </Button>

        {/* Animated overlay search bar for mobile */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`
            fixed top-0 left-0 right-0 z-50
            bg-background border-b border-gray-200
            px-4 py-3 md:hidden
            transform transition-all duration-300 ease-in-out
            ${isSearchOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}
          `}
          role="search"
          aria-hidden={!isSearchOpen}
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
              aria-label="Search input"
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => {
                  setSearchTerm("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative flex">
            <Button
              ref={desktopButtonRef}
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isSearchOpen}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            <form
              ref={desktopFormRef}
              onSubmit={handleSubmit}
              className={`transition-all duration-300 ease-in-out overflow-hidden flex ${
                isSearchOpen ? "w-64 opacity-100 ml-2" : "w-0 opacity-0"
              }`}
              role="search"
              aria-hidden={!isSearchOpen}
            >
              <div className="relative">
                <input
                  type="text"
                  style={{padding: "6px 10px"}}
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-purple-500 focus:outline-none  focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
                  aria-label="Search input"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    style={{background: 'transparent'}}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      setSearchTerm("");
                      desktopFormRef.current?.querySelector("input")?.focus();
                    }}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>
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
      </div>
    </nav>
  );
}