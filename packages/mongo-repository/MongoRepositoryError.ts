import {Document} from 'mongodb'

export class MongoRepositoryError extends Error {
  static fromMessage(message: string) {
    return new MongoRepositoryError({message})
  }

  private static coerceMessage(document: Document): string {
    if (typeof document.error === 'string') {
      return document.error
    } else if (typeof document.error?.message === 'string') {
      return document.error.message
    } else if (typeof document.message === 'string') {
      return document.message
    }

    return 'Unknown error'
  }

  constructor(public readonly document: Document) {
    super(MongoRepositoryError.coerceMessage(document))
  }
}
