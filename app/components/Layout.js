'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Layout({ children }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/overview" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/overview' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Overview
              </Link>
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Keywords
              </Link>
              <Link 
                href="/add-keywords" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/add-keywords' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Add Keywords
              </Link>
              <Link 
                href="/match-types" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/match-types' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Match Types Guide
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow bg-gray-100">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-white font-semibold mb-3">Keyword Manager</h3>
              <p className="text-sm">
                Efficient keyword management tool for your Google Ads campaigns.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/overview" className="hover:text-white">Overview</Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">Keywords</Link>
                </li>
                <li>
                  <Link href="/match-types" className="hover:text-white">Match Types Guide</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:support@example.com" className="hover:text-white">
                    support@example.com
                  </a>
                </li>
                <li>
                  <a href="tel:+1234567890" className="hover:text-white">
                    +123 456 7890
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Keyword Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 