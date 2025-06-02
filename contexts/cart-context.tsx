"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size: string
  color: string
  stock: number
}

interface CartContextType {
  items: CartItem[]
  isInCart: (id: number) => boolean
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(()=>{
    const storedItems = localStorage.getItem("cart")
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
  }, [])

  const addItem = (newItem: CartItem) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(newItem)
    localStorage.setItem('cart', JSON.stringify(cart))
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color,
      )

      if (existingItem) {
        return prev.map((item) =>
          item.id === existingItem.id && item.size === existingItem.size && item.color === existingItem.color
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        )
      }

      return [...prev, newItem]
    })
  }

  const isInCart = (id: number) => {
    return items.some((item) => item.id === id)
  }

  const removeItem = (id: number) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart = cart.filter((item: any) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart))
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart = cart.map((item: any) => item.id == id ? { ...item, quantity } : item)
    localStorage.setItem('cart', JSON.stringify(cart));
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    localStorage.setItem('cart', JSON.stringify([]))
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        isInCart,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
