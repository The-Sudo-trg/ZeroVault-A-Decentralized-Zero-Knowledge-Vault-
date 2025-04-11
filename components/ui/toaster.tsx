"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col p-4 space-y-2 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${
            toast.variant === "destructive" ? "bg-red-900 border-red-800" : "bg-zinc-800 border-zinc-700"
          } border rounded-md shadow-lg p-4 flex items-start justify-between transition-all duration-300 ease-in-out transform translate-x-0 opacity-100`}
          role="alert"
        >
          <div className="flex-1">
            {toast.title && <h3 className="font-medium mb-1">{toast.title}</h3>}
            {toast.description && <p className="text-sm text-zinc-400">{toast.description}</p>}
          </div>
          <button onClick={() => dismiss(toast.id)} className="ml-4 text-zinc-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
