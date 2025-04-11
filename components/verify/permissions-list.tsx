"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock permissions data
const mockPermissions = [
  {
    id: "perm1",
    name: "KYC Service",
    address: "0x1234...5678",
    canVerify: ["Identity", "Age"],
    expiresIn: 25,
    status: "active",
  },
  {
    id: "perm2",
    name: "DeFi Platform",
    address: "0x9876...4321",
    canVerify: ["Age", "Financial Status"],
    expiresIn: 7,
    status: "active",
  },
  {
    id: "perm3",
    name: "Job Application",
    address: "0xabcd...ef01",
    canVerify: ["Education", "Work Experience"],
    expiresIn: -15,
    status: "expired",
  },
]

export default function PermissionsList() {
  const { toast } = useToast()

  const handleRevokePermission = (permissionId: string) => {
    // In a real app, this would call an API to revoke the permission
    toast({
      title: "Permission revoked",
      description: "The verification permission has been revoked",
    })
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle>Access Permissions</CardTitle>
        <CardDescription>Manage who can verify your information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPermissions.map((permission) => (
            <div
              key={permission.id}
              className={`p-4 border border-zinc-700 rounded-md ${permission.status === "expired" ? "opacity-60" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{permission.name}</h4>
                  <p className="text-xs text-zinc-400">{permission.address}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      permission.status === "active"
                        ? "bg-emerald-900/30 text-emerald-500"
                        : "bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {permission.status === "active" ? "Active" : "Expired"}
                  </span>
                  {permission.status === "active" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-400"
                      onClick={() => handleRevokePermission(permission.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-2">Can verify: {permission.canVerify.join(", ")}</p>
              <p className="text-xs text-zinc-500">
                {permission.status === "active"
                  ? `Expires in ${permission.expiresIn} days`
                  : `Expired ${Math.abs(permission.expiresIn)} days ago`}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
