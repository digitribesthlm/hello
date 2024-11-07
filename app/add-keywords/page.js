'use client'

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function AddKeywords() {
  const [campaigns, setCampaigns] = useState([])
  const [formData, setFormData] = useState({
    sokord: '',
    matchType: '',
    kampanj: '',
    annonsgrupp: '',
    status: 'Draft' // Default status
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  // Fetch existing campaigns on load
  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch('/api/keywords')
        const data = await res.json()
        const uniqueCampaigns = [...new Set(data.map(k => k.kampanj))].sort()
        setCampaigns(uniqueCampaigns)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      }
    }
    fetchCampaigns()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/keywords/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: `Keyword "${formData.sokord}" added successfully!` 
        })
        // Clear form
        setFormData({
          sokord: '',
          matchType: '',
          kampanj: '',
          annonsgrupp: '',
          status: 'Draft'
        })
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to add keyword' 
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ 
        type: 'error', 
        text: 'An error occurred while adding the keyword' 
      })
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Add New Keywords</h1>

          {message && (
            <div className={`mb-4 p-4 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keyword
              </label>
              <input
                type="text"
                name="sokord"
                value={formData.sokord}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter keyword..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Match Type
              </label>
              <select
                name="matchType"
                value={formData.matchType}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select match type...</option>
                <option value="Exakt matchning">Exakt matchning</option>
                <option value="Frasmatchning">Frasmatchning</option>
                <option value="Bred matchning">Bred matchning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign
              </label>
              <select
                name="kampanj"
                value={formData.kampanj}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select campaign...</option>
                {campaigns.map(campaign => (
                  <option key={campaign} value={campaign}>{campaign}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Group
              </label>
              <input
                type="text"
                name="annonsgrupp"
                value={formData.annonsgrupp}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter ad group..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Aktiverad">Aktiverad</option>
                <option value="Pausad">Pausad</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                {loading ? 'Adding...' : 'Add Keyword'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
} 