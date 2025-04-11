"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Shield, FileText, Key, Users, Lock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DocumentUploader from "@/components/vault/document-uploader"
import DocumentList from "@/components/vault/document-list"
import VerificationHistory from "@/components/verify/verification-history"
import PermissionsList from "@/components/verify/permissions-list"

export default function DashboardPage() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("documents")

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Please connect your wallet to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8 space-y-4">
            <Shield className="h-16 w-16 text-zinc-400" />
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>You need to connect your wallet to access your ZeroVault dashboard.</AlertDescription>
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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Card 1 */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900/30 text-emerald-500 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Documents Stored</p>
              <h3 className="text-2xl font-bold">3</h3>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card 2 */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900/30 text-emerald-500 mr-4">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Proofs Generated</p>
              <h3 className="text-2xl font-bold">7</h3>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card 3 */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900/30 text-emerald-500 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Active Permissions</p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DocumentUploader />
            <DocumentList />
          </div>
        </TabsContent>

        <TabsContent value="verify">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle>Generate Proof</CardTitle>
                <CardDescription>Create a zero-knowledge proof to verify your identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-zinc-700 rounded-md flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-emerald-900/30 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">Age Verification</h4>
                    <p className="text-sm text-zinc-400">Prove you're above a certain age</p>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Generate</Button>
                </div>

                <div className="p-4 border border-zinc-700 rounded-md flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-emerald-900/30 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">Identity Verification</h4>
                    <p className="text-sm text-zinc-400">Prove your identity without revealing details</p>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Generate</Button>
                </div>

                <div className="p-4 border border-zinc-700 rounded-md flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-emerald-900/30 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">Document Ownership</h4>
                    <p className="text-sm text-zinc-400">Prove you own a document without sharing it</p>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Generate</Button>
                </div>
              </CardContent>
            </Card>

            <VerificationHistory />
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
