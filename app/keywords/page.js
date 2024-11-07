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
  const [campaigns, setCampaigns] = useState([])
  const [showActiveOnly, setShowActiveOnly] = useState(false)
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

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch('/api/kampanjer')
        const data = await res.json()
        setCampaigns(data)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      }
    }
    fetchCampaigns()
  }, [])

  // Get unique values for filters
  const uniqueKampanjer = [...new Set(keywords.map(k => k.kampanj))].sort()
  const uniqueMatchTypes = [...new Set(keywords.map(k => k.matchType))].sort()
  const uniqueAnnonsgrupper = [...new Set(keywords.map(k => k.annonsgrupp).filter(Boolean))].sort()

  // Filter logic
  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.sokord?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleRemoveKeyword = async (keyword) => {
    setModalKeyword(keyword)
  }

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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search keywords..."
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="Aktiverad">Aktiverad</option>
                <option value="Pausad">Pausad</option>
              </select>

              {/* Campaign Filter */}
              <select
                value={kampanjFilter}
                onChange={(e) => setKampanjFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Campaigns</option>
                {uniqueKampanjer.map(kampanj => (
                  <option key={kampanj} value={kampanj}>{kampanj}</option>
                ))}
              </select>

              {/* Match Type Filter */}
              <select
                value={matchTypeFilter}
                onChange={(e) => setMatchTypeFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Match Types</option>
                {uniqueMatchTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Show Active Only Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Show only active campaigns</label>
            </div>
          </div>

          {/* Keywords Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Group</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.annonsgrupp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.matchType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        keyword.status === 'Aktiverad' ? 'bg-green-100 text-green-800' :
                        keyword.status === 'Pausad' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {keyword.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleStatusToggle(keyword)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        {keyword.status === 'Aktiverad' ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {modalKeyword && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium mb-4">Confirm Removal</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove the keyword &quot;{modalKeyword.sokord}&quot;?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setModalKeyword(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}