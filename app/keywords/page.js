// /app/keywords/page.js
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    async function fetchData() {
      try {
        const res = await fetch('/api/keywords')
        if (!res.ok) {
          throw new Error('Failed to fetch keywords')
        }
        const data = await res.json()
        setKeywords(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return <div className="min-h-screen p-4">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen p-4">Error: {error}</div>
  }

  return (
    <div className="min-h-screen p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Keywords</h1>
        <ul className="space-y-2">
          {keywords.map((keyword) => (
            <li key={keyword._id} className="p-2 bg-white rounded shadow">
              {keyword.sokord}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}