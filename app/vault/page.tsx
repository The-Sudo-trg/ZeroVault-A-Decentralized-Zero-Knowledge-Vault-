"use client"

import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DocumentUploader from "@/components/vault/document-uploader"
import DocumentList from "@/components/vault/document-list"

export default function VaultPage() {
  const { isConnected } = useAccount()
  const router = useRouter()

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle>Document Vault</CardTitle>
            <CardDescription>Please connect your wallet to access your document vault</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8 space-y-4">
            <Shield className="h-16 w-16 text-zinc-400" />
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>You need to connect your wallet to access your document vault.</AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/login")} className="bg-emerald-600 hover:bg-emerald-700">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Document Vault</h1>
      <p className="text-zinc-400 mb-8">
        Securely store and manage your encrypted documents. All files are encrypted before being stored on IPFS.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <DocumentUploader />
        </div>
        <div className="lg:col-span-2">
          <DocumentList />
        </div>
      </div>
    </div>
  )
}
