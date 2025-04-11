"use client"

import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, FileText, Key, Users } from "lucide-react"
import DocumentUploader from "@/components/vault/DocumentUploader"
import AgeVerifier from "@/components/verify/AgeVerifier"

export default function Dashboard() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Please connect your wallet to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Shield className="h-16 w-16 text-zinc-400" />
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
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900 text-emerald-500 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Documents Stored</p>
              <h3 className="text-2xl font-bold">3</h3>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Card 2 */}
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900 text-emerald-500 mr-4">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Proofs Generated</p>
              <h3 className="text-2xl font-bold">7</h3>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Card 3 */}
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900 text-emerald-500 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Active Permissions</p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DocumentUploader />
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>
                  Your recently uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-zinc-800 rounded-md">
                    <FileText className="h-5 w-5 text-emerald-500 mr-3" />
                    <div>
                      <p className="font-medium">Passport.pdf</p>
                      <p className="text-xs text-zinc-400">Uploaded 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-zinc-800 rounded-md">
                    <FileText className="h-5 w-5 text-emerald-500 mr-3" />
                    <div>
                      <p className="font-medium">ID_Card.jpg</p>
                      <p className="text-xs text-zinc-400">Uploaded 1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-zinc-800 rounded-md">
                    <FileText className="h-5 w-5 text-emerald-500 mr-3" />
                    <div>
                      <p className="font-medium">Contract_NDA.pdf</p>
                      <p className="text-xs text-zinc-400">Uploaded 2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="verify">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AgeVerifier />
            
            <Card>
              <CardHeader>
                <CardTitle>Verification History</CardTitle>
                <CardDescription>
                  Recent verification requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-zinc-800 rounded-md">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-3"></div>
                    <div className="flex-1">
                      <p className="font-medium">Age Verification (18+)</p>
                      <p className="text-xs text-zinc-400">Verified 3 days ago</p>
                    </div>
                    <span className="text-xs bg-emerald-900/30 text-emerald-500 px-2 py-1 rounded">Success</span>
                  </div>
                  <div className="flex items-center p-3 bg-zinc-800 rounded-md">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-3"></div>
                    <div className="flex-1">
                      <p className="font-medium">Identity Verification</p>
                      <p className="text-xs text-zinc-400">Verified 1 week ago</p>
                    </div>
                    <span className="text-xs bg-emerald-900/30 text-emerald-500 px-2 py-1 rounded">Success</span>
                  </div>
                  <div className="flex items-center p-3 bg-zinc-800 rounded-md">
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-3"></div>
                    <div className="flex-1">
                      <p className="font-medium">Nationality Verification</p>
                      <p className="text-xs text-zinc-400">Attempted 2 weeks ago</p>
                    </div>
                    <span className="text-xs bg-red-900/30 text-red-500 px-2 py-1 rounded">Failed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Access Permissions</CardTitle>
              <CardDescription>
                Manage who can verify your information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-zinc-700 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">KYC Service</h4>
                      <p className="text-xs text-zinc-400">0x1234...5678</p>
                    </div>
                    <span className="text-xs bg-emerald-900/30 text-emerald-500 px-2 py-1 rounded">Active</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">Can verify: Identity, Age</p>
                  <p className="text-xs text-zinc-500">Expires in 25 days</p>
                </div>

                <div className="p-4 border border-zinc-700 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">DeFi Platform</h4>
                      <p className="text-xs text-zinc-400">0x9876...4321</p>
                    </div>
                    <span className="text-xs bg-emerald-900/30 text-emerald-500 px-2 py-1 rounded">Active</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">Can verify: Age, Financial Status</p>
                  <p className="text-xs text-zinc-500">Expires in 7 days</p>  Financial Status</p>
                  <p className="text-xs text-zinc-500">Expires in 7 days</p>
                </div>
                
                <div className="p-4 border border-zinc-700 rounded-md opacity-60">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Job Application</h4>
                      <p className="text-xs text-zinc-400">0xabcd...ef01</p>
                    </div>
                    <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-1 rounded">Expired</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">Could verify: Education, Work Experience</p>
                  <p className="text-xs text-zinc-500">Expired 15 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
  </div>
  )
}
