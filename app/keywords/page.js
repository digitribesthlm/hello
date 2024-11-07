'use client'

import { useState, useEffect, Suspense } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  )
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [kampanjFilter, setKampanjFilter] = useState('all')
  const [adGroupFilter, setAdGroupFilter] = useState('all')
  const [matchTypeFilter, setMatchTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const itemsPerPage = 50

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/keywords')
        if (!res.ok) throw new Error('Failed to fetch keywords')
        const data = await res.json()
        setKeywords(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error:', error)
        setKeywords([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const uniqueKampanjer = Array.from(new Set(keywords.map(k => k.kampanj).filter(Boolean))).sort()
  const uniqueMatchTypes = Array.from(new Set(keywords.map(k => k.matchType).filter(Boolean))).sort()

  const filteredKeywords = keywords.filter(keyword => {
    if (!keyword) return false
    const matchesSearch = (keyword.sokord || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || keyword.status === statusFilter
    const matchesKampanj = kampanjFilter === 'all' || keyword.kampanj === kampanjFilter
    const matchesMatchType = matchTypeFilter === 'all' || keyword.matchType === matchTypeFilter
    return matchesSearch && matchesStatus && matchesKampanj && matchesMatchType
  })

  const totalPages = Math.max(1, Math.ceil(filteredKeywords.length / itemsPerPage))
  const paginatedKeywords = filteredKeywords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleStatusToggle = async (keyword) => {
    if (!keyword?._id) return
    const newStatus = keyword.status === 'Aktiverad' ? 'Pausad' : 'Aktiverad'
    try {
      const response = await fetch('/api/keywords/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywordId: keyword._id,
          newStatus,
          oldStatus: keyword.status
        }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      setKeywords(prevKeywords => prevKeywords.map(kw => 
        kw._id === keyword._id ? { ...kw, status: newStatus } : kw
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const content = loading ? (
    <LoadingSpinner />
  ) : (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Keyword Management</h1>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keywords..."
              className="w-full p-2 border rounded"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Statuses</option>
                <option value="Aktiverad">Active</option>
                <option value="Pausad">Paused</option>
              </select>

              <select
                value={kampanjFilter}
                onChange={(e) => setKampanjFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Campaigns</option>
                {uniqueKampanjer.map(kampanj => (
                  <option key={kampanj} value={kampanj}>{kampanj}</option>
                ))}
              </select>

              <select
                value={matchTypeFilter}
                onChange={(e) => setMatchTypeFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Match Types</option>
                {uniqueMatchTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Keywords Table */}
        <div className="bg-white shadow overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedKeywords.map((keyword) => (
                <tr key={keyword._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{keyword.sokord}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.kampanj}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.matchType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      keyword.status === 'Aktiverad' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {keyword.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleStatusToggle(keyword)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {keyword.status === 'Aktiverad' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Layout>
        {content}
      </Layout>
    </Suspense>
  )
}