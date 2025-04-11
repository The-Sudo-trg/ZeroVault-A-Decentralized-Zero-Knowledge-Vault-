"use client"

import type React from "react"

import { createConfig, configureChains, WagmiConfig as WagmiConfigWrapper } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { polygon, polygonMumbai, mainnet } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, polygonMumbai, mainnet],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "" }), publicProvider()],
)

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export function WagmiConfig({ children }: { children: React.ReactNode }) {
  return <WagmiConfigWrapper config={config}>{children}</WagmiConfigWrapper>
}
