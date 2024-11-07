'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function Layout({ children }) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
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
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow bg-gray-100">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-8 text-center">
        <div className="mb-4">
          <h2 className="text-blue-600 text-xl font-semibold">DigiTribe</h2>
          <p className="text-gray-600 text-sm">Your partner for digital growth across Europe.</p>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <Link href="/privacy" className="text-gray-600 hover:text-gray-800 text-sm">
            Privacy Policy
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/terms" className="text-gray-600 hover:text-gray-800 text-sm">
            Terms of Service
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/cookies" className="text-gray-600 hover:text-gray-800 text-sm">
            Cookie Policy
          </Link>
        </div>

        <div className="text-gray-500 text-sm">
          © 2024 DigiTribe. All rights reserved.
        </div>
      </footer>
    </div>
  )
}