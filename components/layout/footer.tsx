import Link from "next/link"
import { Shield, Github, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-emerald-500 mr-2" />
              <span className="text-white font-bold">ZeroVault</span>
            </div>
            <p className="text-zinc-400 text-sm">
              Secure identity verification and document storage using Zero-Knowledge Proofs and blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-zinc-400 hover:text-white text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-400 hover:text-white text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-zinc-400 hover:text-white text-sm">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-400 hover:text-white text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-white text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">&copy; {new Date().getFullYear()} ZeroVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
