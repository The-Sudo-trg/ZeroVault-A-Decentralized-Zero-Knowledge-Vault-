"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Shield, User, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Shield className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold text-white">ZeroVault</span>
            </Link>

            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link href="/vault" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  My Vault
                </Link>
                <Link
                  href="/verify"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Verify
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-zinc-700 text-emerald-500">
                    <User className="h-4 w-4 mr-2" />
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => disconnect()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => connect()} className="bg-emerald-600 hover:bg-emerald-700">
                Connect Wallet
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/vault"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              My Vault
            </Link>
            <Link
              href="/verify"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Verify
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-zinc-700">
            {isConnected ? (
              <div className="px-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => disconnect()} className="text-gray-400">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="px-4">
                <Button onClick={() => connect()} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
