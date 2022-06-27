import { MongoClient, MongoClientOptions } from 'mongodb'

const defaultOptions: MongoClientOptions = {}

export function client(options = defaultOptions) {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('Please add MONGODB_URI to .env.local')
  }

  return new MongoClient(uri, options)
}

export function connectClient(options = defaultOptions) {
  if (process.env.NODE_ENV === 'development') {
    return global._mongoClientPromise || (global._mongoClientPromise = client(options).connect())
  }

  return client(options).connect()
}

export async function connectDB(options = defaultOptions) {
  const client = await connectClient(options)

  return client.db()
}
