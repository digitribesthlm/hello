import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const kampanjer = await db.collection('kampanjer').find({}).toArray()
    
    console.log('Kampanjer from DB:', kampanjer)
    
    return new Response(JSON.stringify(kampanjer), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in kampanjer API:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch kampanjer' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 