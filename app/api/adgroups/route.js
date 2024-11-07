import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const adGroups = await db.collection('adgroups').find({}).toArray()
    
    console.log('Ad Groups from DB:', adGroups)
    
    return new Response(JSON.stringify(adGroups), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in adgroups API:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch ad groups' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
