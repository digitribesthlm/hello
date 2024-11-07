'use client'

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

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

}
