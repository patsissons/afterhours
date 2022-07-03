import {MongoClient} from 'mongodb'

declare global {
  // eslint-disable-next-line no-var
  declare var _mongoClientPromise: Promise<MongoClient>
}
