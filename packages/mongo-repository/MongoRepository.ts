import {
  Db,
  Document,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
} from 'mongodb'
import {connectDB} from 'utils/mongodb'

import {MongoRepositoryError} from './MongoRepositoryError'
import {
  AnyId,
  BaseDocument,
  BaseModel,
  ISO8601Date,
  DocUpdate,
  ModelIdentifiable,
  ModelUpdate,
  NakedDocument,
  NakedModel,
} from './types'

export abstract class MongoRepository<
  Doc extends BaseDocument,
  Model extends BaseModel,
> {
  private static _db: Db | undefined

  static toDocId(id: string) {
    return ObjectId.createFromHexString(id)
  }

  static fromDocId(_id: ObjectId): string {
    return _id.toHexString() || ''
  }

  static coerceObjectId(id: AnyId) {
    return id instanceof ObjectId ? id : this.toDocId(id)
  }

  static coerceDate(date: ISO8601Date) {
    return new Date(date)
  }

  static async db() {
    if (!this._db) {
      const db = await connectDB()

      if (!this._db) {
        this._db = db
      }
    }

    return this._db
  }

  static async collection<Doc extends Document>(collectionName: string) {
    return (await this.db()).collection<Doc>(collectionName)
  }

  static async find<Doc extends BaseDocument>(
    collectionName: string,
    id: AnyId,
  ) {
    const filter = {_id: this.coerceObjectId(id)} as Filter<Doc>
    const doc = await (
      await this.collection<Doc>(collectionName)
    ).findOne(filter)

    return (doc as Doc) ?? undefined
  }

  static async create<Doc extends BaseDocument>(
    collectionName: string,
    data: NakedDocument<Doc>,
  ): Promise<Doc> {
    const created = new Date()
    const doc = {
      ...sanitize(data as Doc),
      created,
      updated: created,
      deleted: false,
    } as OptionalUnlessRequiredId<Doc>

    const {acknowledged, insertedId: _id} = await (
      await this.collection<Doc>(collectionName)
    ).insertOne(doc)

    if (!acknowledged) {
      throw MongoRepositoryError.fromMessage('insert failed')
    }

    return {...doc, _id} as Doc

    function sanitize({_id, created, updated, deleted, ...doc}: Doc): Document {
      return doc
    }
  }

  static async update<Doc extends BaseDocument>(
    collectionName: string,
    {_id, deleted, ...data}: DocUpdate<Doc>,
  ): Promise<Doc> {
    const filter = {_id} as Filter<Doc>
    const update = {
      $set: {...sanitize(data as Doc), updated: new Date(), deleted},
    } as UpdateFilter<Doc>
    const {ok, value, lastErrorObject} = await (
      await this.collection<Doc>(collectionName)
    ).findOneAndUpdate(filter, update)

    if (!ok || !value) {
      throw new MongoRepositoryError(
        lastErrorObject ?? {message: 'update failed'},
      )
    }

    return value as Doc

    function sanitize({_id, created, updated, ...doc}: Doc): Document {
      return doc
    }
  }

  static async delete<Doc extends BaseDocument>(
    collectionName: string,
    {id}: ModelIdentifiable,
  ): Promise<Doc> {
    const filter = {_id: this.toDocId(id)} as Filter<Doc>
    const update = {
      $set: {
        updated: new Date(),
        deleted: true,
      } as Doc,
    } as UpdateFilter<Doc>
    const {ok, value, lastErrorObject} = await (
      await this.collection<Doc>(collectionName)
    ).findOneAndUpdate(filter, update)

    if (!ok || !value) {
      throw new MongoRepositoryError(
        lastErrorObject ?? {message: 'delete failed'},
      )
    }

    return value as Doc
  }

  protected constructor(public readonly collectionName: string) {}

  public db() {
    return MongoRepository.db()
  }

  public collection<T extends Document = Doc>() {
    return MongoRepository.collection<T>(this.collectionName)
  }

  public async find(id: AnyId) {
    const doc = await MongoRepository.find<Doc>(this.collectionName, id)

    return this.toModel(doc)
  }

  public async create(data: NakedModel<Model>) {
    const result = await MongoRepository.create<Doc>(
      this.collectionName,
      this.coerceDoc(data),
    )

    return this.toModel(result)
  }

  public async update(data: ModelUpdate<Model>) {
    const result = await MongoRepository.update<Doc>(
      this.collectionName,
      this.toDoc(data as Model),
    )

    return this.toModel(result)
  }

  public async delete(data: ModelIdentifiable) {
    const result = await MongoRepository.delete<Doc>(this.collectionName, data)

    return this.toModel(result)
  }

  protected coerceObjectId(id: string | ObjectId) {
    return MongoRepository.coerceObjectId(id)
  }

  protected coerceDate(date: ISO8601Date) {
    return MongoRepository.coerceDate(date)
  }

  protected toDoc({id, created, updated, deleted, ...model}: Model): Doc {
    return {
      ...this.coerceDoc(model),
      _id: this.coerceObjectId(id),
      created: this.coerceDate(created),
      updated: this.coerceDate(updated),
      deleted,
    } as Doc
  }

  protected toModel(doc: Doc): Model
  protected toModel(doc?: Doc | null): Model | undefined
  protected toModel(doc?: Doc) {
    if (!doc) {
      return undefined
    }

    const {_id, created, updated, ...model} = doc

    return {
      ...this.coerceModel(model as NakedDocument<Doc>),
      id: MongoRepository.fromDocId(_id),
      created: created.toISOString(),
      updated: updated.toISOString(),
    } as Model
  }

  protected coerceDoc(data: NakedModel<Model>): NakedDocument<Doc> {
    return data as any
  }

  protected coerceModel(data: NakedDocument<Doc>): NakedModel<Model> {
    return data as any
  }
}
