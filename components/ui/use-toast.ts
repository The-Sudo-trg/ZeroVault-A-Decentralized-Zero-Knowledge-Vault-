"use client"

import type React from "react"

// Adapted from shadcn/ui toast component
import { useState, useCallback } from "react"

export type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export type ToastActionElement = React.ReactElement

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ title, description, variant, action }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant, action }
    setToasts((prevToasts) => [...prevToasts, newToast])
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  }
}
