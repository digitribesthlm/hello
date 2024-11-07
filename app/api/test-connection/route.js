import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    // Get counts
    const keywordCount = await db.collection('keywords').countDocuments()
    const userCount = await db.collection('users').countDocuments()
    const kampanjCount = await db.collection('kampanjer').countDocuments()
    const changeLogCount = await db.collection('changeLogs').countDocuments()
    
    // Get all users
    const users = await db.collection('users').find({}).toArray()
    
    const response = {
      summary: {
        database: db.databaseName,
        totalDocuments: {
          keywords: keywordCount,
          users: userCount,
          kampanjer: kampanjCount,
          changeLogs: changeLogCount
        }
      },
      users: users
    }
    
    return new Response(JSON.stringify(response, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 