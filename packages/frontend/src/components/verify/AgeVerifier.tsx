"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle } from "lucide-react"
import { generateAgeProof, verifyAgeProof } from "@/utils/zkProofs"

export default function AgeVerifier() {
  const [ageThreshold, setAgeThreshold] = useState("18")
  const [activeTab, setActiveTab] = useState("generate")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [proof, setProof] = useState("")
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)

  const handleGenerateProof = async () => {
    setIsGenerating(true)
    try {
      // This would be implemented in utils/zkProofs.ts
      const generatedProof = await generateAgeProof(Number.parseInt(ageThreshold))
      setProof(generatedProof)
    } catch (error) {
      console.error("Failed to generate proof:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVerifyProof = async () => {
    if (!proof) return

    setIsVerifying(true)
    try {
      // This would be implemented in utils/zkProofs.ts
      const result = await verifyAgeProof(proof, Number.parseInt(ageThreshold))
      setVerificationResult(result)
    } catch (error) {
      console.error("Failed to verify proof:", error)
      setVerificationResult(false)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Age Verification</CardTitle>
        <CardDescription>Prove you're above a certain age without revealing your actual age</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Proof</TabsTrigger>
            <TabsTrigger value="verify">Verify Proof</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4 mt-4">
            <div className="space-y-2">
              <p className="text-sm">Select the age threshold you want to prove you're above:</p>
              <Select value={ageThreshold} onValueChange={setAgeThreshold}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18">18 years</SelectItem>
                  <SelectItem value="21">21 years</SelectItem>
                  <SelectItem value="25">25 years</SelectItem>
                  <SelectItem value="65">65 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateProof}
              disabled={isGenerating}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <span className="mr-2">Generating Proof</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Generate Age Proof"
              )}
            </Button>

            {proof && (
              <div className="p-3 bg-zinc-800 rounded-md">
                <p className="text-xs text-zinc-400 mb-1">Generated Proof:</p>
                <p className="text-xs font-mono break-all">{proof}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="verify" className="space-y-4 mt-4">
            <div className="space-y-2">
              <p className="text-sm">Enter the proof to verify:</p>
              <textarea
                className="w-full h-24 p-2 text-xs font-mono bg-zinc-800 border border-zinc-700 rounded-md"
                placeholder="Paste the zero-knowledge proof here..."
                value={proof}
                onChange={(e) => setProof(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm">Select the age threshold to verify against:</p>
              <Select value={ageThreshold} onValueChange={setAgeThreshold}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age threshold" />
                </SelectTrigger>
                <SelectContent>
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
                  <span className="mr-2">Verifying Proof</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Verify Age Proof"
              )}
            </Button>

            {verificationResult !== null && (
              <div
                className={`p-3 rounded-md flex items-center ${
                  verificationResult
                    ? "bg-emerald-900/20 border border-emerald-800 text-emerald-500"
                    : "bg-red-900/20 border border-red-800 text-red-500"
                }`}
              >
                {verificationResult ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Proof verified! The person is above {ageThreshold} years old.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 mr-2" />
                    <span>
                      Verification failed. The proof is invalid or the person is not above {ageThreshold} years old.
                    </span>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
