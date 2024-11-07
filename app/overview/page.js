'use client'

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function Overview() {
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)

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

  // Calculate statistics
  const stats = {
    totalKeywords: keywords.length,
    activeKeywords: keywords.filter(k => k.status === 'Aktiverad').length,
    pausedKeywords: keywords.filter(k => k.status === 'Pausad').length,
    removedKeywords: keywords.filter(k => k.status === 'Removed').length,
    campaigns: [...new Set(keywords.map(k => k.kampanj))],
    adGroups: [...new Set(keywords.map(k => k.annonsgrupp).filter(Boolean))],
    matchTypes: [...new Set(keywords.map(k => k.matchType))]
  }

  // Get keywords by campaign
  const keywordsByCampaign = stats.campaigns.map(campaign => ({
    name: campaign,
    total: keywords.filter(k => k.kampanj === campaign).length,
    active: keywords.filter(k => k.kampanj === campaign && k.status === 'Aktiverad').length,
    paused: keywords.filter(k => k.kampanj === campaign && k.status === 'Pausad').length
  }))

  if (loading) return <Layout><div className="p-4">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Overview</h1>

          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Total Keywords</h3>
              <p className="text-3xl font-bold">{stats.totalKeywords}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Active Keywords</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeKeywords}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Paused Keywords</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pausedKeywords}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Campaigns</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.campaigns.length}</p>
            </div>
          </div>

          {/* Campaign Overview */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Overview</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Campaign</th>
                      <th className="text-right py-3 px-4">Total Keywords</th>
                      <th className="text-right py-3 px-4">Active</th>
                      <th className="text-right py-3 px-4">Paused</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywordsByCampaign.map(campaign => (
                      <tr key={campaign.name} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{campaign.name}</td>
                        <td className="text-right py-3 px-4">{campaign.total}</td>
                        <td className="text-right py-3 px-4 text-green-600">{campaign.active}</td>
                        <td className="text-right py-3 px-4 text-yellow-600">{campaign.paused}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Match Type Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Match Types</h2>
              <div className="space-y-4">
                {stats.matchTypes.map(type => {
                  const count = keywords.filter(k => k.matchType === type).length
                  const percentage = ((count / stats.totalKeywords) * 100).toFixed(1)
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-gray-600">{type}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-sm text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Ad Groups</h2>
              <div className="space-y-4">
                {stats.adGroups.slice(0, 5).map(group => {
                  const count = keywords.filter(k => k.annonsgrupp === group).length
                  return (
                    <div key={group} className="flex items-center justify-between">
                      <span className="text-gray-600">{group}</span>
                      <span className="text-sm font-medium">{count} keywords</span>
                    </div>
                  )
                })}
                {stats.adGroups.length > 5 && (
                  <div className="text-sm text-gray-500 text-center pt-2">
                    And {stats.adGroups.length - 5} more ad groups
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 