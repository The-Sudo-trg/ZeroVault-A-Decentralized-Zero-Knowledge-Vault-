"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { generateAgeProof, verifyAgeProof } from "@/lib/zk-utils"

export default function VerifyPage() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("generate")
  const [ageThreshold, setAgeThreshold] = useState("18")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [proof, setProof] = useState("")
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle>Identity Verification</CardTitle>
            <CardDescription>Please connect your wallet to access verification tools</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8 space-y-4">
            <Shield className="h-16 w-16 text-zinc-400" />
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>You need to connect your wallet to access verification tools.</AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/login")} className="bg-emerald-600 hover:bg-emerald-700">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleGenerateProof = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // Simulate progress updates
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Generate the proof
      const generatedProof = await generateAgeProof(Number.parseInt(ageThreshold))
      clearInterval(interval)
      setGenerationProgress(100)
      setProof(generatedProof)

      toast({
        title: "Proof generated successfully",
        description: "Your zero-knowledge proof is ready to be shared",
      })
    } catch (error) {
      console.error("Failed to generate proof:", error)
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate the proof. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVerifyProof = async () => {
    if (!proof) return

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      // Verify the proof
      const result = await verifyAgeProof(proof, Number.parseInt(ageThreshold))
      setVerificationResult(result)

      toast({
        title: result ? "Verification successful" : "Verification failed",
        description: result
          ? "The proof is valid and confirms the age requirement"
          : "The proof is invalid or does not meet the age requirement",
        variant: result ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Failed to verify proof:", error)
      setVerificationResult(false)
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "An error occurred during verification",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Identity Verification</h1>

      <div className="max-w-3xl mx-auto">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle>Age Verification</CardTitle>
            <CardDescription>Prove you're above a certain age without revealing your actual age</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
                <TabsTrigger value="generate">Generate Proof</TabsTrigger>
                <TabsTrigger value="verify">Verify Proof</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="age-threshold">Select the age threshold you want to prove you're above:</Label>
                  <Select value={ageThreshold} onValueChange={setAgeThreshold} disabled={isGenerating}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select age threshold" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="18">18 years</SelectItem>
                      <SelectItem value="21">21 years</SelectItem>
                      <SelectItem value="25">25 years</SelectItem>
                      <SelectItem value="65">65 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Generating zero-knowledge proof...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}

                <Button
                  onClick={handleGenerateProof}
                  disabled={isGenerating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Generating Proof</span>
                    </div>
                  ) : (
                    "Generate Age Proof"
                  )}
                </Button>

                {proof && (
                  <div className="space-y-2">
                    <Label htmlFor="generated-proof">Generated Proof:</Label>
                    <div className="relative">
                      <Textarea
                        id="generated-proof"
                        value={proof}
                        readOnly
                        className="h-32 font-mono text-xs bg-zinc-800 border-zinc-700"
                      />
                      <Button
                        className="absolute top-2 right-2 h-6 text-xs"
                        variant="secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(proof)
                          toast({
                            title: "Copied to clipboard",
                            description: "The proof has been copied to your clipboard",
                          })
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Share this proof with verifiers. They can validate your age without knowing your actual birthdate.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="verify" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="proof-to-verify">Enter the proof to verify:</Label>
                  <Textarea
                    id="proof-to-verify"
                    placeholder="Paste the zero-knowledge proof here..."
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    className="h-32 font-mono text-xs bg-zinc-800 border-zinc-700"
                    disabled={isVerifying}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verify-age-threshold">Select the age threshold to verify against:</Label>
                  <Select value={ageThreshold} onValueChange={setAgeThreshold} disabled={isVerifying}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select age threshold" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="18">18 years</SelectItem>
                      <SelectItem value="21">21 years</SelectItem>
                      <SelectItem value="25">25 years</SelectItem>
                      <SelectItem value="65">65 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleVerifyProof}
                  disabled={!proof || isVerifying}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isVerifying ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Verifying Proof</span>
                    </div>
                  ) : (
                    "Verify Age Proof"
                  )}
                </Button>

                {verificationResult !== null && (
                  <Alert
                    className={`${
                      verificationResult ? "bg-emerald-900/20 border-emerald-800" : "bg-red-900/20 border-red-800"
                    }`}
                  >
                    {verificationResult ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <AlertDescription className="text-emerald-500">
                          Proof verified! The person is above {ageThreshold} years old.
                        </AlertDescription>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-500">
                          Verification failed. The proof is invalid or the person is not above {ageThreshold} years old.
                        </AlertDescription>
                      </>
                    )}
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
