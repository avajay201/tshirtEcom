"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { cartItemAdd, cartItemRemove, cartItems, cartItemUpdate } from "@/action/APIAction"


interface CartItem {
  id: number
  variant: number
  product: number
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
  total: number,
  isLoading: boolean,
  fetchCartItems: () => void,
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<CartItem[]>([])

  const fetchCartItems = async()=>{
    setIsLoading(true);
    const result = await cartItems();
    setIsLoading(false);
    if (result){
      setItems(result)
    }
  }

  useEffect(()=>{
    const isLocal = !localStorage.getItem('name') && !localStorage.getItem('email') && !localStorage.getItem('access_token');
    if (isLocal){
      const storedItems = localStorage.getItem("cart")
      if (storedItems) {
        setItems(JSON.parse(storedItems))
      }
    }
    else{
      fetchCartItems();
    }
    setIsLoading(false);
  }, [])

  const addItem = async (newItem: CartItem) => {
    const isLocal = !localStorage.getItem('name') && !localStorage.getItem('email') && !localStorage.getItem('access_token');
    if (isLocal){
      let cart = JSON.parse(localStorage.getItem('cart') || '[]')
      newItem.id = items.length + 1
      cart.push(newItem)
      localStorage.setItem('cart', JSON.stringify(cart))
      setItems((prev) => {
        return [...prev, newItem]
      })
    }
    else{
      const result = await cartItemAdd({variant_id: newItem.variant, quantity: newItem.quantity});
      if (result){
        setItems((prev) => {
          return [...prev, result]
        })
      }
    }
  }

  const isInCart = (id: number) => {
    return items.some((item) => item.variant === id)
  }

  const removeItem = async (id: number) => {
    setIsLoading(true);
    const isLocal = !localStorage.getItem('name') && !localStorage.getItem('email') && !localStorage.getItem('access_token');
    if (isLocal){
      let cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cart = cart.filter((item: any) => item.variant !== id);
      localStorage.setItem('cart', JSON.stringify(cart))
      setItems((prev) => prev.filter((item) => item.variant !== id))
    }
    else{
      const removeToItem = items.filter(item => item.variant === id)
      const result = await cartItemRemove({item_id: removeToItem[0].id});
      if (result){
        setItems((prev) => prev.filter((item) => item.variant !== id))
      }
    }
    setIsLoading(false);
  }

  const updateQuantity = async(id: number, quantity: number) => {
    setIsLoading(true);
    const isLocal = !localStorage.getItem('name') && !localStorage.getItem('email') && !localStorage.getItem('access_token');
    if (isLocal){
      let cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cart = cart.map((item: any) => item.id == id ? { ...item, quantity } : item)
      localStorage.setItem('cart', JSON.stringify(cart));
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
    else{
      const result = await cartItemUpdate({item_id: id, quantity: quantity});
      if (result){
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
      }
    }
    setIsLoading(false);
  }

  const clearCart = async() => {
    setIsLoading(true);
    const isLocal = !localStorage.getItem('name') && !localStorage.getItem('email') && !localStorage.getItem('access_token');
    if (isLocal){
      localStorage.setItem('cart', JSON.stringify([]))
      setItems([])
    }
    else{
      const result = await cartItemRemove({item_id: 0});
      if (result){
        setItems([])
      }
    }
    setIsLoading(false);
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
        isLoading,
        fetchCartItems,
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
