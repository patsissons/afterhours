import {MongoClient, MongoClientOptions} from 'mongodb'

import {isDevelopment, MONGODB_URI} from './env'

const defaultOptions: MongoClientOptions = {}

export function client(options = defaultOptions) {
  const uri = MONGODB_URI

  if (!uri) {
    throw new Error('Please add MONGODB_URI to .env.local')
  }

  return new MongoClient(uri, options)
}

export function connectClient(options = defaultOptions) {
  if (isDevelopment) {
    return (
      global._mongoClientPromise ||
      (global._mongoClientPromise = client(options).connect())
    )
  }

  return client(options).connect()
}

export async function connectDB(options = defaultOptions) {
  const client = await connectClient(options)

  return client.db()
}
