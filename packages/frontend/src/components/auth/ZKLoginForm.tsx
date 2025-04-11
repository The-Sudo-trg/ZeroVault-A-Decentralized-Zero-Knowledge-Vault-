"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Key, AlertCircle } from "lucide-react"
import { generateZKProof } from "@/utils/zkProofs"

export default function ZKLoginForm() {
  const [identity, setIdentity] = useState("")
  const [password, setPassword] = useState("")
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identity || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setIsGeneratingProof(true)
      setError("")

      // This would be implemented in utils/zkProofs.ts
      const proof = await generateZKProof(identity, password)

      // Here you would verify the proof with your smart contract
      console.log("Generated proof:", proof)

      // Redirect to dashboard on success
      // router.push('/dashboard')
    } catch (error) {
      console.error("Login failed:", error)
      setError("Failed to generate proof. Please try again.")
    } finally {
      setIsGeneratingProof(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <Shield className="h-12 w-12 text-emerald-500" />
        </div>
        <CardTitle className="text-2xl text-center">ZeroVault</CardTitle>
        <CardDescription className="text-center">Login with Zero-Knowledge Proof</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identity">Identity Commitment</Label>
            <Input
              id="identity"
              placeholder="Enter your identity commitment"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Secret Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your secret password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-zinc-400">
              Your password is never sent to the server. It's used locally to generate a zero-knowledge proof.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-md flex items-center text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isGeneratingProof}>
            {isGeneratingProof ? (
              <div className="flex items-center">
                <span className="mr-2">Generating Proof</span>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Key className="h-4 w-4 mr-2" />
                Login with ZK Proof
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-zinc-400">
          New to ZeroVault?{" "}
          <a href="/register" className="text-emerald-500 hover:underline">
            Register
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
