import {
  Collection,
  Db,
  Document,
  Filter,
  ObjectId,
  OptionalId,
  WithId,
} from 'mongodb'
import {RegionalEvent} from 'types/events'
import {connectDB} from 'utils/mongodb'

export interface RegionalEventDocument
  extends Omit<RegionalEvent, 'id' | 'date'> {
  date: Date
}

export interface FromRegionOptions {
  deleted?: boolean
  skip?: number
}

export type ResultOrError<T> = {value: T} | {error: Document}

export class EventRepository {
  public static default = new EventRepository()

  static fromDoc(doc: OptionalId<RegionalEventDocument>): RegionalEvent
  static fromDoc(
    doc?: OptionalId<RegionalEventDocument> | null,
  ): RegionalEvent | undefined

  static fromDoc(
    doc?: OptionalId<RegionalEventDocument> | null,
  ): RegionalEvent | undefined {
    if (!doc) {
      return undefined
    }

    const {_id, date, ...event} = doc

    return {
      ...event,
      id: _id?.toHexString() || '',
      date: date.toISOString(),
    }
  }

  static toDoc({
    id,
    date,
    ...event
  }: RegionalEvent): WithId<RegionalEventDocument> {
    return {
      ...event,
      _id: ObjectId.createFromHexString(id),
      date: new Date(date),
    }
  }

  private _db: Db | undefined

  private constructor() {}

  async find(id: string | ObjectId): Promise<RegionalEvent | undefined> {
    const doc = await this.withEvents((events) =>
      events.findOne({
        _id: id instanceof ObjectId ? id : ObjectId.createFromHexString(id),
      }),
    )

    return EventRepository.fromDoc(doc)
  }

  async fromRegion(
    org: string,
    region: string,
    {deleted = false, skip = 0}: FromRegionOptions,
  ): Promise<RegionalEvent[]> {
    const filters: Filter<WithId<RegionalEventDocument>>[] = [{org}, {region}]

    if (!deleted) {
      filters.push({deleted: false})
    }

    return this.withEvents((events) =>
      events
        .find({$and: filters})
        .sort({date: -1})
        .skip(skip)
        .limit(5)
        .map((doc) => EventRepository.fromDoc(doc))
        .toArray(),
    )
  }

  async create({
    date,
    ...event
  }: Omit<RegionalEvent, 'id'>): Promise<ResultOrError<RegionalEvent>> {
    const doc: RegionalEventDocument = {
      ...event,
      date: new Date(date),
      deleted: false,
    }

    const {acknowledged, insertedId: _id} = await this.withEvents((events) =>
      events.insertOne(doc),
    )

    if (!acknowledged) {
      return {error: {message: 'insert failed'}}
    }

    return {value: EventRepository.fromDoc({_id, ...doc})}
  }

  async update({
    id,
    date,
    details,
    deleted,
  }: RegionalEvent): Promise<ResultOrError<RegionalEvent>> {
    const _id = ObjectId.createFromHexString(id)
    const {
      ok,
      value,
      lastErrorObject: error = {message: 'update failed'},
    } = await this.withEvents((events) =>
      events.findOneAndUpdate(
        {_id},
        {$set: {date: new Date(date), details, deleted}},
      ),
    )

    if (!ok || !value) {
      return {error}
    }

    return {value: EventRepository.fromDoc(value)}
  }

  async delete(id: RegionalEvent['id']): Promise<ResultOrError<RegionalEvent>> {
    const _id = ObjectId.createFromHexString(id)
    const {
      ok,
      value,
      lastErrorObject: error = {message: 'deleted failed'},
    } = await this.withEvents((events) =>
      events.findOneAndUpdate({_id}, {$set: {deleted: true}}),
    )

    if (!ok || !value) {
      return {error}
    }

    return {value: EventRepository.fromDoc(value)}
  }

  private async withEvents<T>(
    then: (events: Collection<RegionalEventDocument>) => T,
  ): Promise<T> {
    if (!this._db) {
      this._db = await connectDB()
    }

    return then(this._db.collection<RegionalEventDocument>('events'))
  }
}
