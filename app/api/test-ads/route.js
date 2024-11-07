import { MongoClient } from 'mongodb'

export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI)
    const db = client.db('adskeywords')  // Explicitly connect to adskeywords
    
    const stats = {
      database: db.databaseName,
      keywords: await db.collection('keywords').countDocuments(),
      users: await db.collection('users').countDocuments(),
      collections: await db.listCollections().toArray()
    }
    
    await client.close()
    
    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 