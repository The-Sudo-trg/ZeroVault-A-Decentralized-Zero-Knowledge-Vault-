"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Key, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { generateZKProof } from "@/lib/zk-utils"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("zk-login")
  const [identity, setIdentity] = useState("")
  const [password, setPassword] = useState("")
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleZKLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identity || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setIsGeneratingProof(true)
      setError("")

      // Generate ZK proof
      const proof = await generateZKProof(identity, password)
      console.log("Generated proof:", proof)

      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Login successful",
        description: "You have been authenticated using zero-knowledge proof",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      setError("Failed to generate proof. Please try again.")
    } finally {
      setIsGeneratingProof(false)
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
          <CardTitle className="text-2xl text-center">Welcome to ZeroVault</CardTitle>
          <CardDescription className="text-center">Secure login with zero-knowledge proof technology</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="zk-login">ZK Login</TabsTrigger>
              <TabsTrigger value="wallet-login">Wallet Login</TabsTrigger>
            </TabsList>
            <TabsContent value="zk-login">
              <form onSubmit={handleZKLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="identity">Identity Commitment</Label>
                  <Input
                    id="identity"
                    placeholder="Enter your identity commitment"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
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
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                  <p className="text-xs text-zinc-400">
                    Your password is never sent to the server. It's used locally to generate a zero-knowledge proof.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isGeneratingProof}
                >
                  {isGeneratingProof ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Generating Proof</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Key className="h-4 w-4 mr-2" />
                      <span>Login with ZK Proof</span>
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="wallet-login">
              <div className="space-y-4 mt-4">
                <p className="text-sm text-zinc-400">
                  Connect your wallet to authenticate using your blockchain identity.
                </p>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Connect Wallet</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-zinc-400">
            New to ZeroVault?{" "}
            <Link href="/register" className="text-emerald-500 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
