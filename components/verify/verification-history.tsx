import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock verification history data
const mockVerifications = [
  {
    id: "verify1",
    type: "Age Verification (18+)",
    date: "2023-11-10T15:30:00Z",
    status: "success",
  },
  {
    id: "verify2",
    type: "Identity Verification",
    date: "2023-10-25T09:45:00Z",
    status: "success",
  },
  {
    id: "verify3",
    type: "Nationality Verification",
    date: "2023-09-18T14:20:00Z",
    status: "failed",
  },
  {
    id: "verify4",
    type: "Document Ownership",
    date: "2023-09-05T11:10:00Z",
    status: "success",
  },
]

export default function VerificationHistory() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle>Verification History</CardTitle>
        <CardDescription>Recent verification requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockVerifications.map((verification) => (
            <div key={verification.id} className="flex items-center p-3 bg-zinc-800 rounded-md">
              <div
                className={`h-2 w-2 rounded-full ${
                  verification.status === "success" ? "bg-emerald-500" : "bg-red-500"
                } mr-3`}
              ></div>
              <div className="flex-1">
                <p className="font-medium">{verification.type}</p>
                <p className="text-xs text-zinc-400">
                  {verification.status === "success" ? "Verified" : "Attempted"} {formatDate(verification.date)}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  verification.status === "success"
                    ? "bg-emerald-900/30 text-emerald-500"
                    : "bg-red-900/30 text-red-500"
                }`}
              >
                {verification.status === "success" ? "Success" : "Failed"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
