import {
  BaseDocument,
  Deletable,
  ModelIdentifiable,
  ModelTimestampable,
} from './types'
import {Repository} from './repository'

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

export class RegionRepository extends Repository<RegionDocument, RegionModel> {
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

  // async create(region: Region): ResultPromise<RegionModel> {
  //   const created = new Date()
  //   const doc: OptionalId<RegionDocument> = {
  //     ...region,
  //     created,
  //     updated: created,
  //     deleted: false,
  //   }

  //   const {acknowledged, insertedId: _id} = await (
  //     await this.collection<typeof doc>()
  //   ).insertOne(doc)

  //   if (!acknowledged) {
  //     return {error: {message: 'insert failed'}}
  //   }

  //   return {value: this.toModel({_id, ...doc})}
  // }

  // async update({
  //   id,
  //   details,
  //   deleted,
  // }: RegionModel): ResultPromise<RegionModel> {
  //   const _id = Repository.toDocId(id)
  //   const {
  //     ok,
  //     value,
  //     lastErrorObject: error = {message: 'update failed'},
  //   } = await (
  //     await this.collection()
  //   ).findOneAndUpdate({_id}, {$set: {details, updated: new Date(), deleted}})

  //   if (!ok || !value) {
  //     return {error}
  //   }

  //   return {value: this.toModel(value)}
  // }

  // async delete({id}: ModelIdentifiable) {
  //   const _id = Repository.toDocId(id)
  //   const {
  //     ok,
  //     value,
  //     lastErrorObject: error = {message: 'delete failed'},
  //   } = await (
  //     await this.collection()
  //   ).findOneAndUpdate({_id}, {$set: {updated: new Date(), deleted: true}})

  //   if (!ok || !value) {
  //     return {error}
  //   }

  //   return {value: this.toModel(value)}
  // }
}
