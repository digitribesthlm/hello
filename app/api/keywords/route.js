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
    const { db } = await connectToDatabase()
    const data = await request.json()
    
    const result = await db.collection('keywords').insertOne({
      ...data,
      created_at: new Date()
    })

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error creating keyword:', error)
    return new Response(JSON.stringify({ error: 'Failed to create keyword' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 