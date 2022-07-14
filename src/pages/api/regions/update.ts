import type {NextApiRequest, NextApiResponse} from 'next'
import {RegionModel, RegionRepository} from 'data'
import {ApiResponse} from 'types'
import {apiAction} from 'utils/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<RegionModel>>,
) {
  return apiAction(req, res, 'update region').run<RegionModel>((input) =>
    RegionRepository.default.update(input),
  )
}
