'use client'
import { useState, useEffect } from 'react'
import Layout from '@/app/components/Layout'

export default function AddKeywords() {
  const [kampanjer, setKampanjer] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [availableAdGroups, setAvailableAdGroups] = useState([])
  const [message, setMessage] = useState(null)

  // Fetch campaigns on load
  useEffect(() => {
    async function fetchKampanjer() {
      try {
        const res = await fetch('/api/kampanjer')
        const data = await res.json()
        const uniqueCampaigns = [...new Map(data.map(item => [item.name, item])).values()]
        setKampanjer(uniqueCampaigns)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      }
    }
    fetchKampanjer()
  }, [])

  // Handle campaign selection and fetch ad groups
  const handleCampaignChange = async (e) => {
    const campaignName = e.target.value
    setSelectedCampaign(campaignName)
    
    if (campaignName) {
      try {
        const res = await fetch('/api/kampanjer')
        const data = await res.json()
        
        // Filter ad groups for selected campaign
        const adGroups = data
          .filter(k => k.name === campaignName)
          .map(k => k.adGroup)
        
        console.log('Ad groups for campaign:', adGroups)
        setAvailableAdGroups(adGroups)
      } catch (error) {
        console.error('Error fetching ad groups:', error)
        setAvailableAdGroups([])
      }
    } else {
      setAvailableAdGroups([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sokord: e.target.sokord.value,
          matchType: e.target.matchType.value,
          kampanj: selectedCampaign,
          annonsgrupp: e.target.annonsgrupp.value,
          status: e.target.status.value
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add keyword')
      }

      setMessage({ type: 'success', text: 'Keyword added successfully!' })
      e.target.reset()
      setSelectedCampaign('')
      setAvailableAdGroups([])
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while adding the keyword' })
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl mb-4">Add Keywords</h1>
        
        {message && (
          <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sökord
            </label>
            <input
              type="text"
              name="sokord"
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Match Type
            </label>
            <select
              name="matchType"
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Match Type</option>
              <option value="Exact">Exact</option>
              <option value="Phrase">Phrase</option>
              <option value="Broad">Broad</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kampanj
            </label>
            <select
              name="kampanj"
              required
              value={selectedCampaign}
              onChange={handleCampaignChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Campaign</option>
              {kampanjer.map((kampanj) => (
                <option key={kampanj._id} value={kampanj.name}>
                  {kampanj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annonsgrupp
            </label>
            <select
              name="annonsgrupp"
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Ad Group</option>
              {availableAdGroups.map((group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Pausad">Pausad</option>
              <option value="Review">Review</option>
            </select>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Keyword
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
} 