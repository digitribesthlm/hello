// /app/keywords/page.js
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from '../components/Layout'

export default function KeywordsPage() {
  const [data, setData] = useState({ keywords: [], loading: true, error: null });
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (typeof window !== 'undefined') {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/keywords');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const jsonData = await response.json();
          setData({ keywords: Array.isArray(jsonData) ? jsonData : [], loading: false, error: null });
        } catch (error) {
          setData({ keywords: [], loading: false, error: error.message });
        }
      };
      fetchData();
    }
  }, [status, router]);

  if (status === 'loading' || data.loading) {
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
}