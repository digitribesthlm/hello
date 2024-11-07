'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'  // <-- This was the issue
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
          <h1 className="text-3xl font-bold mb-6">Keyword Management</h1>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keywords..."
              className="w-full p-2 border rounded mb-4"
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
                {[...new Set(keywords.map(k => k.kampanj))].sort().map(kampanj => (
                  <option key={kampanj} value={kampanj}>{kampanj}</option>
                ))}
              </select>

              <select
                value={matchTypeFilter}
                onChange={(e) => setMatchTypeFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Match Types</option>
                {[...new Set(keywords.map(k => k.matchType))].sort().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Keywords Table */}
          <div className="bg-white shadow overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keywords
                  .filter(keyword => 
                    keyword.sokord?.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (statusFilter === 'all' || keyword.status === statusFilter) &&
                    (kampanjFilter === 'all' || keyword.kampanj === kampanjFilter) &&
                    (matchTypeFilter === 'all' || keyword.matchType === matchTypeFilter)
                  )
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((keyword) => (
                    <tr key={keyword._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{keyword.sokord}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.kampanj}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          keyword.status === 'Aktiverad' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'
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
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(keywords.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(keywords.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(keywords.length / itemsPerPage)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}