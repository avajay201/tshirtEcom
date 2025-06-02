"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  name: string
  email: string
  access_token: string
}

interface AuthContextType {
  user: User | null,
  logout: () => void,
  loggedIn: (name: string, email: string, access_token: string) => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const name = localStorage.getItem('name')
    const email = localStorage.getItem('email')
    const access_token = localStorage.getItem('access_token')
    if (name && email && access_token) {
      setUser({ name, email, access_token })
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    localStorage.removeItem('access_token')
    setUser(null)
  }

  const loggedIn = (name: string, email: string, access_token: string) => {
    localStorage.setItem('name', name)
    localStorage.setItem('email', email)
    localStorage.setItem('access_token', access_token)
    setUser({ name, email, access_token })
  }

  return (
    <AuthContext.Provider value={{ user, logout, loggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
