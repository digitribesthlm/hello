import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request) {
  try {
    const { keywordId, newStatus, oldStatus } = await request.json()
    const { db } = await connectToDatabase()

    // Update keyword status
    const result = await db.collection('keywords').updateOne(
      { _id: new ObjectId(keywordId) },
      { $set: { status: newStatus } }
    )

    // Add to changelog
    await db.collection('changeLogs').insertOne({
      keywordId: new ObjectId(keywordId),
      oldStatus,
      newStatus,
      timestamp: new Date()
    })

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      throw new Error('Failed to update keyword')
    }

  } catch (error) {
    console.error('Error updating keyword status:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 