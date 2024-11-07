import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const campaign = searchParams.get('campaign')

    if (!campaign) {
      return new Response(JSON.stringify({ error: 'Campaign name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection('kampanjer')
      .find({ name: campaign })
      .toArray()

    const adGroups = [...new Set(result.map(k => k.adGroup))]

    return new Response(JSON.stringify({ adGroups }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('API Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch ad groups' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 