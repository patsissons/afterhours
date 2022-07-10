import {Filter} from 'mongodb'

import {
  BaseDocument,
  Deletable,
  ISO8601Date,
  ModelIdentifiable,
  ModelTimestampable,
  NakedDocument,
  NakedModel,
  WithDates,
} from './types'
import {Repository} from './repository'

export interface RegionalEventDetails {
  location: {
    name: string
    coords?: string
    url?: string
  }
  notes?: string
}

export interface RegionalEvent {
  org: string
  region: string
  date: ISO8601Date
  details: RegionalEventDetails
}

export interface RegionalEventDocument
  extends BaseDocument,
    WithDates<RegionalEvent, 'date'> {}

export interface RegionalEventModel
  extends RegionalEvent,
    ModelIdentifiable,
    ModelTimestampable,
    Deletable {}

export interface FromRegionOptions {
  deleted?: boolean
  skip?: number
}

export class EventRepository extends Repository<
  RegionalEventDocument,
  RegionalEventModel
> {
  public static CollectionName = 'events'
  public static default = new EventRepository()

  private constructor() {
    super(EventRepository.CollectionName)
  }

  async fromRegion(
    org: string,
    region: string,
    {deleted = false, skip = 0}: FromRegionOptions,
  ): Promise<RegionalEventModel[]> {
    const filters: Filter<RegionalEventDocument>[] = [{org}, {region}]

    if (!deleted) {
      filters.push({deleted: false})
    }

    return (await this.collection())
      .find({$and: filters})
      .sort({date: -1})
      .skip(skip)
      .limit(5)
      .map((doc) => this.toModel(doc))
      .toArray()
  }

  protected override coerceDoc({
    date,
    ...model
  }: NakedModel<RegionalEventModel>): NakedDocument<RegionalEventDocument> {
    return {
      ...model,
      date: new Date(date),
    }
  }

  protected override coerceModel({
    date,
    ...doc
  }: NakedDocument<RegionalEventDocument>): NakedModel<RegionalEventModel> {
    return {
      ...doc,
      date: date.toISOString(),
    }
  }
}
