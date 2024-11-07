'use client'

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [kampanjFilter, setKampanjFilter] = useState('all')
  const [adGroupFilter, setAdGroupFilter] = useState('all')
  const [matchTypeFilter, setMatchTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalKeyword, setModalKeyword] = useState(null)
  const [showRemoved, setShowRemoved] = useState(false)
  const itemsPerPage = 50

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/keywords')
        const data = await res.json()
        setKeywords(data)
        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get unique values for filters
  const uniqueKampanjer = [...new Set(keywords.map(k => k.kampanj))].sort()
  const uniqueMatchTypes = [...new Set(keywords.map(k => k.matchType))].sort()
  const uniqueAnnonsgrupper = [...new Set(keywords.map(k => k.annonsgrupp).filter(Boolean))].sort()

  // Filter logic
  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.sokord.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || keyword.status === statusFilter
    const matchesKampanj = kampanjFilter === 'all' || keyword.kampanj === kampanjFilter
    const matchesAnnonsgrupp = adGroupFilter === 'all' || keyword.annonsgrupp === adGroupFilter
    const matchesMatchType = matchTypeFilter === 'all' || keyword.matchType === matchTypeFilter
    const isNotRemoved = showRemoved ? true : keyword.status !== 'Removed'
    return matchesSearch && matchesStatus && matchesKampanj && matchesAnnonsgrupp && matchesMatchType && isNotRemoved
  })

  // Pagination
  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage)
  const paginatedKeywords = filteredKeywords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Status toggle function
  const handleStatusToggle = async (keyword) => {
    const newStatus = keyword.status === 'Aktiverad' ? 'Pausad' : 'Aktiverad'
    try {
      const response = await fetch('/api/keywords/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywordId: keyword._id,
          newStatus,
          oldStatus: keyword.status
        }),
      })

      if (response.ok) {
        setKeywords(keywords.map(kw => 
          kw._id === keyword._id 
            ? { ...kw, status: newStatus }
            : kw
        ))
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Remove keyword function
  const handleRemoveKeyword = async (keyword) => {
    setModalKeyword(keyword)
  }

  // Confirm remove function
  const confirmRemove = async () => {
    if (!modalKeyword) return

    try {
      const response = await fetch('/api/keywords/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywordId: modalKeyword._id,
          newStatus: 'Removed',
          oldStatus: modalKeyword.status
        }),
      })

      if (response.ok) {
        setKeywords(keywords.map(kw => 
          kw._id === modalKeyword._id 
            ? { ...kw, status: 'Removed' }
            : kw
        ))
      }
    } catch (error) {
      console.error('Error removing keyword:', error)
    }
    setModalKeyword(null)
  }

  if (loading) return <Layout><div className="p-4">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Add link back to dashboard */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Keyword Management</h1>
            <Link 
              href="/dashboard" 
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {/* Rest of the existing keyword management UI */}
          {/* ... filters, table, modals, etc. ... */}
        </div>
      </div>
    </Layout>
  )
} 