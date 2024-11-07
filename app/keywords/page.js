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
  const [campaigns, setCampaigns] = useState([])
  const [showActiveOnly, setShowActiveOnly] = useState(false)

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
      const res = await fetch('/api/kampanjer')
      const data = await res.json()
      setCampaigns(data)
    }
    fetchCampaigns()
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

  const filteredCampaigns = showActiveOnly 
    ? campaigns.filter(campaign => campaign.visningar > 0)
    : campaigns

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

          <div className="max-w-7xl mx-auto p-4">
            <div className="flex flex-col space-y-4 mb-6">
              <h1 className="text-2xl font-bold">Sökord</h1>
              
              {/* Search input */}
              <input
                type="text"
                placeholder="Search sökord..."
                className="..."
              />

              {/* Add the active campaigns checkbox here */}
              <div className="flex items-center bg-white p-3 rounded-lg shadow">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Show only active campaigns
                </label>
              </div>

              {/* Match Type dropdown */}
              <select className="...">
                <option>All Match Types</option>
                ...
              </select>

              {/* Rest of your filters */}
              ...
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.adGroup}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.visningar || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 