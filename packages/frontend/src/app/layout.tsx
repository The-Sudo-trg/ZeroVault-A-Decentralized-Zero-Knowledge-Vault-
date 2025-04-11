import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/layout/Navbar"
import { WagmiConfig } from "@/components/WagmiProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZeroVault - Zero-Knowledge Identity & Document Vault",
  description:
    "Secure identity verification and document storage using Zero-Knowledge Proofs and blockchain technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <WagmiConfig>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
            </div>
          </WagmiConfig>
        </ThemeProvider>
      </body>
    </html>
  )
}
