import {Region, RegionModel} from 'data'
import {ApiResponse} from 'types'

export interface RegionsContextType {
  regions: RegionModel[]
  refresh(): Promise<void>
  create(region: Region): Promise<ApiResponse<RegionModel>>
}
