"use client"

import type React from "react"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, Lock, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { encryptFile, uploadToIPFS } from "@/lib/storage-utils"

export default function DocumentUploader() {
  const { isConnected } = useAccount()
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [documentName, setDocumentName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "encrypting" | "uploading" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [ipfsHash, setIpfsHash] = useState("")
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Auto-fill document name from filename
      if (!documentName) {
        setDocumentName(selectedFile.name.split(".")[0])
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !documentType || !documentName || !isConnected) return

    try {
      setIsUploading(true)
      setUploadStatus("encrypting")
      setProgress(20)
      setError("")

      // Encrypt the file
      const encryptedFile = await encryptFile(file)
      setProgress(50)
      setUploadStatus("uploading")

      // Upload to IPFS
      const hash = await uploadToIPFS(encryptedFile)
      setProgress(100)
      setIpfsHash(hash)
      setUploadStatus("success")

      toast({
        title: "Document uploaded successfully",
        description: `Your document has been encrypted and stored securely`,
      })
    } catch (error) {
      console.error("Upload failed:", error)
      setUploadStatus("error")
      setError("Failed to upload document. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setDocumentName("")
    setDocumentType("")
    setUploadStatus("idle")
    setProgress(0)
    setIpfsHash("")
    setError("")
  }

  if (!isConnected) {
    return (
      <Card className="border-zinc-800 bg-zinc-900">
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
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>Documents are encrypted before being stored on IPFS</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadStatus === "success" ? (
          <div className="space-y-4">
            <Alert className="bg-emerald-900/20 border-emerald-800">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-emerald-500">Document uploaded successfully!</AlertDescription>
            </Alert>

            <div className="p-4 border border-zinc-700 rounded-md">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">{documentName}</span>
              </div>
              <p className="text-xs text-zinc-400 mb-2">Document Type: {documentType}</p>
              <p className="text-xs text-zinc-400">
                IPFS Hash: <span className="font-mono">{ipfsHash.slice(0, 20)}...</span>
              </p>
            </div>

            <Button onClick={resetForm} variant="outline" className="w-full border-zinc-700">
              Upload Another Document
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-name">Document Name</Label>
              <Input
                id="document-name"
                placeholder="Enter document name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                disabled={isUploading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType} disabled={isUploading}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
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
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isUploading
                    ? "border-zinc-700 bg-zinc-800/50"
                    : "border-zinc-700 hover:border-emerald-700/50 cursor-pointer"
                }`}
                onClick={() => !isUploading && document.getElementById("file")?.click()}
              >
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
                <Input id="file" type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
              </div>
              <p className="text-xs text-zinc-400">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max size: 10MB)</p>
            </div>

            {(uploadStatus === "encrypting" || uploadStatus === "uploading") && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>{uploadStatus === "encrypting" ? "Encrypting document..." : "Uploading to IPFS..."}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {uploadStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      {uploadStatus !== "success" && (
        <CardFooter>
          <Button
            onClick={handleUpload}
            disabled={!file || !documentType || !documentName || isUploading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isUploading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>{uploadStatus === "encrypting" ? "Encrypting" : "Uploading"}</span>
              </div>
            ) : (
              <span>Upload Document</span>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
