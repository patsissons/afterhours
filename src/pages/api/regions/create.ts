import type {NextApiRequest, NextApiResponse} from 'next'
import {ApiResponse} from 'types'
import {RegionModel, RegionRepository} from 'data'
import {apiAction} from 'src/utils/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<RegionModel>>,
) {
  return apiAction(req, res, 'create region').run<RegionModel>((input) =>
    RegionRepository.default.create(input),
  )
}
