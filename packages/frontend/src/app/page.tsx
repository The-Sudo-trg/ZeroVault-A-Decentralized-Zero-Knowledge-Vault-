import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, FileText, Key } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-zinc-900">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Shield className="h-16 w-16 text-emerald-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                ZeroVault: Secure Identity & Document Storage
              </h1>
              <p className="text-xl mb-8 text-zinc-300">
                Store and verify sensitive information without revealing the data itself, powered by Zero-Knowledge
                Proofs and blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-zinc-700">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-zinc-800">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900 text-emerald-500 mb-4 mx-auto">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-white">Zero-Knowledge Identity</h3>
                <p className="text-zinc-400 text-center">
                  Prove your identity attributes without revealing the actual data. Verify age, nationality, or
                  eligibility while maintaining privacy.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900 text-emerald-500 mb-4 mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-white">Encrypted Document Vault</h3>
                <p className="text-zinc-400 text-center">
                  Store sensitive documents securely in encrypted form on IPFS. Only you control who can access your
                  information.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-900 text-emerald-500 mb-4 mx-auto">
                  <Key className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-white">Blockchain Security</h3>
                <p className="text-zinc-400 text-center">
                  Built on Ethereum/Polygon for transparent, immutable record-keeping of permissions and access
                  controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-zinc-900">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
            <div className="max-w-3xl mx-auto">
              <ol className="relative border-l border-zinc-700">
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-emerald-900 text-emerald-500">
                    1
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-2">Register & Create Your Vault</h3>
                  <p className="text-zinc-400">
                    Connect your wallet and create a secure identity commitment using zero-knowledge cryptography.
                  </p>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-emerald-900 text-emerald-500">
                    2
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload & Encrypt Documents</h3>
                  <p className="text-zinc-400">
                    Add your sensitive documents to your vault. They're encrypted before being stored on IPFS.
                  </p>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-emerald-900 text-emerald-500">
                    3
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-2">Generate Zero-Knowledge Proofs</h3>
                  <p className="text-zinc-400">
                    Create proofs that verify specific attributes without revealing the underlying data.
                  </p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-emerald-900 text-emerald-500">
                    4
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-2">Share & Verify</h3>
                  <p className="text-zinc-400">
                    Share proofs with third parties who can verify them without seeing your private information.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-emerald-500 mr-2" />
              <span className="text-white font-bold">ZeroVault</span>
            </div>
            <div className="text-zinc-400 text-sm">
              &copy; {new Date().getFullYear()} ZeroVault. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
