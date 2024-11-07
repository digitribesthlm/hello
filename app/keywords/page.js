'use client'

import { useState, useEffect } from 'react'
import Layout from '@/app/components/Layout'

export default function KeywordsPage() {
  const [data, setData] = useState({ keywords: [], loading: true, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/keywords');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData({ keywords: Array.isArray(jsonData) ? jsonData : [], loading: false, error: null })
      } catch (error) {
        setData({ keywords: [], loading: false, error: error.message });
      }
    };
    fetchData();
  }, []);

  if (data.loading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (data.error) {
    return <Layout><div>Error: {data.error}</div></Layout>;
  }

  return (
    <Layout>
      <div>
        <h1>Keywords</h1>
        <ul>
          {data.keywords.map((keyword) => (
            <li key={keyword._id}>{keyword.sokord}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );

  const { keywords, loading, error } = data;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const [searchTerm, setSearchTerm] = useState('');
  const filteredKeywords = keywords.filter((keyword) =>
    keyword.sokord?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage);
  const currentKeywords = filteredKeywords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Keyword Management</h1>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords..."
            className="w-full p-2 border rounded mb-4"
          />
        </div>

        <div className="bg-white shadow overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentKeywords.map((keyword, index) => (
                <tr key={index}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </div>
    </div>
  );
}
