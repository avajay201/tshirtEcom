"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface WishlistItem {
  id: number
  name: string
  price: number
  image: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  isInWishlist: (id: number) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(()=>{
    const storedItems = localStorage.getItem("wishlist")
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
  }, [])

  const addItem = (newItem: WishlistItem) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    wishlist.push(newItem)
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
    setItems((prev) => {
      const exists = prev.find((item) => item.id === newItem.id)
      if (exists) return prev
      return [...prev, newItem]
    })
  }

  const removeItem = (id: number) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    wishlist = wishlist.filter((item: any) => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: number) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    localStorage.setItem('wishlist', JSON.stringify([]))
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
