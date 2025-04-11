"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Lock, Trash2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { retrieveFromIPFS, decryptFile } from "@/lib/storage-utils"

// Mock document data
const mockDocuments = [
  {
    id: "doc1",
    name: "Passport",
    type: "passport",
    uploadedAt: "2023-11-15T10:30:00Z",
    ipfsHash: "QmX7b5jxn6Jp7gVHXRhTSJJQYWS89YxCZeaYK4SPc1aHLq",
  },
  {
    id: "doc2",
    name: "Driver's License",
    type: "license",
    uploadedAt: "2023-10-22T14:45:00Z",
    ipfsHash: "QmYbvaNcXadFmkuRtBxhN5LyT9NwJhH8rJt8b7JQghwvzm",
  },
  {
    id: "doc3",
    name: "Employment Contract",
    type: "contract",
    uploadedAt: "2023-09-05T09:15:00Z",
    ipfsHash: "QmZ9t5KYTQVfTYMmZxSZVCVBBLJX5sDsyxw95SHzHPdGrK",
  },
]

export default function DocumentList() {
  const [selectedDocument, setSelectedDocument] = useState<(typeof mockDocuments)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const handleDownload = async (document: (typeof mockDocuments)[0]) => {
    try {
      setSelectedDocument(document)
      setIsLoading(true)

      // Retrieve from IPFS
      const encryptedBlob = await retrieveFromIPFS(document.ipfsHash)

      setIsLoading(false)
      setIsDecrypting(true)

      // Decrypt the file
      const decryptedBlob = await decryptFile(encryptedBlob)

      // Create download link
      const url = URL.createObjectURL(decryptedBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${document.name}.pdf` // Assuming PDF for simplicity
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Document downloaded",
        description: "Your document has been decrypted and downloaded",
      })
    } catch (error) {
      console.error("Download failed:", error)
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to retrieve and decrypt the document",
      })
    } finally {
      setIsLoading(false)
      setIsDecrypting(false)
      setSelectedDocument(null)
    }
  }

  const handleDelete = (documentId: string) => {
    // In a real app, this would call an API to delete the document
    toast({
      title: "Document deleted",
      description: "The document has been removed from your vault",
    })
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle>My Documents</CardTitle>
        <CardDescription>Your securely stored documents</CardDescription>
      </CardHeader>
      <CardContent>
        {mockDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-zinc-500 mb-3" />
            <p className="text-zinc-400">No documents found in your vault</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockDocuments.map((document) => (
              <div key={document.id} className="p-4 bg-zinc-800 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-emerald-500 mr-3" />
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <p className="text-xs text-zinc-400">Uploaded {formatDate(document.uploadedAt)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-700">
                        <DialogHeader>
                          <DialogTitle>{document.name}</DialogTitle>
                          <DialogDescription>Document details and preview</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="p-4 bg-zinc-800 rounded-md mb-4">
                            <p className="text-sm mb-2">
                              <span className="text-zinc-400">Type:</span> {document.type}
                            </p>
                            <p className="text-sm mb-2">
                              <span className="text-zinc-400">Uploaded:</span> {formatDate(document.uploadedAt)}
                            </p>
                            <p className="text-sm mb-2">
                              <span className="text-zinc-400">IPFS Hash:</span>
                            </p>
                            <p className="text-xs font-mono break-all text-zinc-500">{document.ipfsHash}</p>
                          </div>
                          <Alert className="bg-zinc-800 border-zinc-700">
                            <Lock className="h-4 w-4 text-emerald-500" />
                            <AlertDescription className="text-zinc-400">
                              This document is encrypted. You need to download and decrypt it to view the contents.
                            </AlertDescription>
                          </Alert>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => handleDownload(document)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download & Decrypt
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(document)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-400"
                      onClick={() => handleDelete(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading dialog */}
        <Dialog open={isLoading || isDecrypting}>
          <DialogContent className="bg-zinc-900 border-zinc-700">
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
              <DialogTitle>{isLoading ? "Retrieving Document" : "Decrypting Document"}</DialogTitle>
              <DialogDescription>
                {isLoading
                  ? "Fetching your encrypted document from IPFS..."
                  : "Decrypting your document securely in your browser..."}
              </DialogDescription>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
