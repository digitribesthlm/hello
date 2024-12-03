// /app/keywords/page.js
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Layout = dynamic(() => import('../components/Layout'), { ssr: false })

export default function KeywordsPage() {
  const [data, setData] = useState({ keywords: [], loading: true, error: null });
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Session status:', status);
    if (status === 'unauthenticated') {
      console.log('Redirecting to login');
      router.push('/login');
      return;
    }

    if (typeof window !== 'undefined') {
      // Fetch data only on the client side
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
  }, [status]);

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