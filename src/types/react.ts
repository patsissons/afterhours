import {RegionModel} from 'src/data'

export type EmptyProps = Record<string, never>
export type PageProps<P = unknown> =
  | (P & {org?: string; regions?: RegionModel[]})
  | {error: any}
