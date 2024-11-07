'use client'

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function Dashboard() {
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

  const exportToCSV = () => {
    const headers = [
      'Sökord',
      'Match Type',
      'Kampanj',
      'Annonsgrupp',
      'Status'
    ]

    const csvRows = [
      headers.join(','),
      ...filteredKeywords.map(keyword => [
        `"${keyword.sokord || ''}"`,
        `"${keyword.matchType || ''}"`,
        `"${keyword.kampanj || ''}"`,
        `"${keyword.annonsgrupp || ''}"`,
        `"${keyword.status || ''}"`,
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `keywords_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) return <Layout><div className="p-4">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with export button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Keywords Management</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export to CSV</span>
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white p-4 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sökord</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search sökord..."
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Match Type</label>
                <select
                  value={matchTypeFilter}
                  onChange={(e) => setMatchTypeFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Match Types</option>
                  {uniqueMatchTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kampanj</label>
                <select
                  value={kampanjFilter}
                  onChange={(e) => setKampanjFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Campaigns</option>
                  {uniqueKampanjer.map(kampanj => (
                    <option key={kampanj} value={kampanj}>{kampanj}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annonsgrupp</label>
                <select
                  value={adGroupFilter}
                  onChange={(e) => setAdGroupFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Ad Groups</option>
                  {uniqueAnnonsgrupper.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Statuses</option>
                  <option value="Aktiverad">Aktiverad</option>
                  <option value="Pausad">Pausad</option>
                </select>
              </div>
            </div>
          </div>

          {/* Show/Hide removed keywords toggle */}
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="showRemoved"
              checked={showRemoved}
              onChange={(e) => setShowRemoved(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="showRemoved" className="text-sm text-gray-600">
              Show removed keywords
            </label>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sökord</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kampanj</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Annonsgrupp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedKeywords.map((keyword) => (
                  <tr key={keyword._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{keyword.sokord}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{keyword.matchType}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{keyword.kampanj}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {keyword.annonsgrupp || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${keyword.status === 'Aktiverad' 
                          ? 'bg-green-100 text-green-800' 
                          : keyword.status === 'Removed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {keyword.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {keyword.status !== 'Removed' && (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleStatusToggle(keyword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title={keyword.status === 'Aktiverad' ? 'Pause keyword' : 'Activate keyword'}
                          >
                            {keyword.status === 'Aktiverad' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Remove keyword"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 rounded shadow">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {modalKeyword && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Remove Keyword</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to remove this keyword?
                </p>
                <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">{modalKeyword.sokord}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Campaign: {modalKeyword.kampanj}<br/>
                    Ad Group: {modalKeyword.annonsgrupp || '-'}
                  </p>
                </div>
              </div>
              <div className="items-center px-4 py-3 gap-4 flex justify-center">
                <button
                  onClick={() => setModalKeyword(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}