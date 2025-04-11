"use client"

import type React from "react"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Lock, FileText } from "lucide-react"
import { encryptFile, uploadToIPFS } from "@/utils/storage"

export default function DocumentUploader() {
  const { isConnected } = useAccount()
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [ipfsHash, setIpfsHash] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !documentType || !isConnected) return

    try {
      setIsUploading(true)

      // This would be implemented in the utils/storage.ts file
      const encryptedFile = await encryptFile(file)
      const hash = await uploadToIPFS(encryptedFile)

      setIpfsHash(hash)
      setUploadStatus("success")
    } catch (error) {
      console.error("Upload failed:", error)
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Uploader</CardTitle>
          <CardDescription>Connect your wallet to upload documents to your vault</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Lock className="h-16 w-16 text-zinc-400" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>Documents are encrypted before being stored on IPFS</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document-type">Document Type</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">ID Card</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="license">Driver's License</SelectItem>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Document File</Label>
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-6 w-6 text-emerald-500" />
                <span>{file.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-zinc-400" />
                <p className="text-sm text-zinc-400">Drag and drop or click to upload</p>
              </div>
            )}
            <Input id="file" type="file" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        {uploadStatus === "success" && (
          <div className="p-3 bg-emerald-900/20 border border-emerald-800 rounded-md text-emerald-500 text-sm">
            Document uploaded successfully! IPFS Hash: {ipfsHash.slice(0, 10)}...
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-red-500 text-sm">
            Failed to upload document. Please try again.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!file || !documentType || isUploading}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {isUploading ? "Encrypting & Uploading..." : "Upload Document"}
        </Button>
      </CardFooter>
    </Card>
  )
}
