import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const keywords = await db.collection('keywords')
      .find({})
      .sort({ created_at: -1 })
      .toArray()

    return new Response(JSON.stringify(keywords), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching keywords:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch keywords' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request) {
  try {
    const keyword = await request.json()
    const { db } = await connectToDatabase()

    // Add created_at timestamp
    keyword.created_at = new Date()

    const result = await db.collection('keywords').insertOne(keyword)

    return new Response(JSON.stringify({ 
      success: true, 
      keywordId: result.insertedId 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error adding keyword:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to add keyword' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 