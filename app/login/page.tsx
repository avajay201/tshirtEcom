"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { loginUser } from "@/action/APIAction"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { loggedIn } = useAuth()
  const router = useRouter()

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")


const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
if (!clientId && process.env.NODE_ENV !== "production") {
  console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google login will not work.")
}

const handleGoogleLogin = async (credentialResponse: any) => {
  setIsLoading(true)
  setError("")
  try {
    const jwt = credentialResponse.credential
    const success = await login("", "", jwt)
    if (success) {
      router.push("/")
    } else {
      setError("Google login failed. Please try again.")
    }
  } catch (err) {
    setError("Something went wrong with Google login. Please try again.")
  } finally {
    setIsLoading(false)
  }
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setEmailError("")
    setPasswordError("")

    let valid = true

    if (email.trim() === "") {
      setEmailError("Email is required")
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email")
      valid = false
    }

    if (password.trim() === "") {
      setPasswordError("Password is required")
      valid = false
    }

    if (!valid) {
      setIsLoading(false)
      return
    }

    const result = await loginUser({
      email: email,
      password: password,
    })
    setIsLoading(false)

    if (result[0] === 200){
      setEmail("")
      setPassword("")
      loggedIn(result[1].name, result[1].email, result[1].access)
      router.push("/")
    }
    else{
      setError(result[1])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your TeeStyle account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              or continue with
            </span>
          </div>

          {/* CHANGED: Added Google OAuth login */}
<GoogleOAuthProvider clientId={clientId}>
  <GoogleLogin
    onSuccess={handleGoogleLogin}
    onError={() => setError("Google login failed. Please try again.")}
    useOneTap={false}
    prompt="select_account"
  >
    <Button variant="outline" className="w-full" disabled={isLoading}>
      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </Button>
  </GoogleLogin>
</GoogleOAuthProvider>
{/* END CHANGED */}

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
