/* eslint-disable no-process-env */

export const GITHUB_ID = process.env.GITHUB_ID
export const GITHUB_SECRET = process.env.GITHUB_SECRET
export const GOOGLE_ID = process.env.GOOGLE_ID
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET
export const MONGODB_URI = process.env.MONGODB_URI
export const SECRET = process.env.SECRET
export const NODE_ENV = process.env.NODE_ENV
export const VERCEL_URL = process.env.VERCEL_URL

export const isDevelopment = Boolean(NODE_ENV === 'development')
export const isProduction = Boolean(NODE_ENV === 'production')
