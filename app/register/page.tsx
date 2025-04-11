"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, User, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { generateIdentityCommitment } from "@/lib/zk-utils"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setIsGenerating(true)
      setError("")

      // Generate identity commitment
      const identityCommitment = await generateIdentityCommitment(email, password)
      console.log("Generated identity commitment:", identityCommitment)

      // Simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Registration successful",
        description: "Your ZeroVault account has been created",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration failed:", error)
      setError("Failed to create account. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-emerald-900/30">
              <Shield className="h-10 w-10 text-emerald-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Create Your ZeroVault Account</CardTitle>
          <CardDescription className="text-center">
            Register to start using zero-knowledge proofs for your identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                required
              />
              <p className="text-xs text-zinc-400">
                Your password is used to generate your zero-knowledge identity commitment. Make sure it's strong and
                unique.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isGenerating}>
              {isGenerating ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Creating Account</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Register</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-500 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
