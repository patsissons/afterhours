import {
  BaseDocument,
  Deletable,
  ModelIdentifiable,
  ModelTimestampable,
  MongoRepository,
} from 'mongo-repository'

export interface RegionDetails {
  displayName: string
  visible: boolean
  notes: string
}

export interface Region {
  org: string
  name: string
  details: RegionDetails
}

export interface RegionDocument extends BaseDocument, Region {}

export interface RegionModel
  extends Region,
    ModelIdentifiable,
    ModelTimestampable,
    Deletable {}

export class RegionRepository extends MongoRepository<
  RegionDocument,
  RegionModel
> {
  public static CollectionName = 'regions'
  public static default = new RegionRepository()

  private constructor() {
    super(RegionRepository.CollectionName)
  }

  async fromOrg(org: string) {
    return (await this.collection())
      .find({org})
      .map((doc) => this.toModel(doc))
      .toArray()
  }

  async fromName(org: string, name: string) {
    const doc = await (await this.collection()).findOne({$and: [{org}, {name}]})

    return this.toModel(doc)
  }
}
