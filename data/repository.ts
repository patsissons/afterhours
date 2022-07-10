import {
  Db,
  Document,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
} from 'mongodb'
import {ResultOrError} from 'types'
import {connectDB} from 'utils/mongodb'

import {
  AnyId,
  BaseDocument,
  BaseModel,
  DocUpdate,
  ModelIdentifiable,
  ModelUpdate,
  NakedDocument,
  NakedModel,
  ResultPromise,
} from './types'

export abstract class Repository<
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
  ): ResultPromise<Doc> {
    const created = new Date()
    const doc = {
      ...(data as Document),
      created,
      updated: created,
      deleted: false,
    } as OptionalUnlessRequiredId<Doc>

    const {acknowledged, insertedId: _id} = await (
      await this.collection<Doc>(collectionName)
    ).insertOne(doc)

    if (!acknowledged) {
      return {error: {message: 'insert failed'}}
    }

    return {value: {...doc, _id} as Doc}
  }

  static async update<Doc extends BaseDocument>(
    collectionName: string,
    {_id, deleted, ...data}: DocUpdate<Doc>,
  ): ResultPromise<Doc> {
    const filter = {_id} as Filter<Doc>
    const update = {
      $set: {...(data as Document), updated: new Date(), deleted},
    } as UpdateFilter<Doc>
    const {
      ok,
      value,
      lastErrorObject: error = {message: 'update failed'},
    } = await (
      await this.collection<Doc>(collectionName)
    ).findOneAndUpdate(filter, update)

    if (!ok || !value) {
      return {error}
    }

    return {value: value as Doc}
  }

  static async delete<Doc extends BaseDocument>(
    collectionName: string,
    {id}: ModelIdentifiable,
  ): ResultPromise<Doc> {
    const filter = {_id: this.toDocId(id)} as Filter<Doc>
    const update = {
      $set: {updated: new Date(), deleted: true},
    } as UpdateFilter<Doc>
    const {
      ok,
      value,
      lastErrorObject: error = {message: 'delete failed'},
    } = await (
      await this.collection<Doc>(collectionName)
    ).findOneAndUpdate(filter, update)

    if (!ok || !value) {
      return {error}
    }

    return {value: value as Doc}
  }

  protected constructor(public readonly collectionName: string) {}

  public db() {
    return Repository.db()
  }

  public collection<T extends Document = Doc>() {
    return Repository.collection<T>(this.collectionName)
  }

  public async find(id: AnyId) {
    const doc = await Repository.find<Doc>(this.collectionName, id)

    return this.toModel(doc)
  }

  public async create(data: NakedModel<Model>) {
    const result = await Repository.create<Doc>(
      this.collectionName,
      this.coerceDoc(data),
    )

    return this.toErrorOrModel(result)
  }

  public async update({id, deleted, ...model}: ModelUpdate<Model>) {
    const data: DocUpdate<Doc> = {
      ...this.coerceDoc(model as NakedModel<Model>),
      _id: this.coerceObjectId(id),
      deleted,
    }
    const result = await Repository.update<Doc>(this.collectionName, data)

    return this.toErrorOrModel(result)
  }

  public async delete(data: ModelIdentifiable) {
    const result = await Repository.delete<Doc>(this.collectionName, data)

    return this.toErrorOrModel(result)
  }

  protected coerceObjectId(id: string | ObjectId) {
    return Repository.coerceObjectId(id)
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
      id: Repository.fromDocId(_id),
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

  private toErrorOrModel(result: ResultOrError<Doc, Document>) {
    if ('error' in result) {
      return result
    }

    return {value: this.toModel(result.value)}
  }
}
