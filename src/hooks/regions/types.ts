import {ModelIdentifiable} from 'mongo-repository'
import {Region, RegionModel} from 'data'
import {ApiResponse} from 'types'

export interface RegionsContextType {
  regions: RegionModel[]
  fetch(): Promise<ApiResponse<RegionModel[]>>
  create(region: Region): Promise<ApiResponse<RegionModel>>
  update(region: RegionModel): Promise<ApiResponse<RegionModel>>
  remove(id: ModelIdentifiable): Promise<ApiResponse<RegionModel>>
}
