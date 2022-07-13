import type {ObjectId} from 'mongodb'

export type AnyId = string | ObjectId
export type ISO8601Date = string

export interface Deletable {
  deleted?: boolean
}

export interface MongoIdentifiable {
  _id: ObjectId
}

export interface MongoTimestampable {
  created: Date
  updated: Date
}

export interface BaseDocument
  extends MongoIdentifiable,
    MongoTimestampable,
    Deletable {}

export interface ModelIdentifiable {
  id: string
}

export interface ModelTimestampable {
  created: ISO8601Date
  updated: ISO8601Date
}

export interface BaseModel
  extends ModelIdentifiable,
    ModelTimestampable,
    Deletable {}

export type WithDates<T, Fields extends keyof T> = {
  [K in keyof T]: K extends Fields ? Date : T[K]
}
export type NakedDocument<Doc extends BaseDocument> = Omit<
  Doc,
  keyof MongoIdentifiable | keyof MongoTimestampable | keyof Deletable
>
export type NakedModel<Model extends BaseModel> = Omit<
  Model,
  keyof ModelIdentifiable | keyof ModelTimestampable | keyof Deletable
>
export type DocUpdate<Doc extends BaseDocument> = MongoIdentifiable &
  Deletable &
  Partial<NakedDocument<Doc>>
export type ModelUpdate<Model extends BaseModel> = ModelIdentifiable &
  Deletable &
  Partial<NakedModel<Model>>
