import {ModelIdentifiable} from 'mongo-repository'
import type {NextApiRequest, NextApiResponse} from 'next'
import {RegionRepository} from 'data'
import {apiAction} from 'utils/api'
import {ApiResponse} from 'types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ModelIdentifiable>>,
) {
  return apiAction(req, res, 'delete region').run<ModelIdentifiable>((input) =>
    RegionRepository.default.delete(input),
  )
}
