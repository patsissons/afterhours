import type {NextApiRequest, NextApiResponse} from 'next'
import {ApiResponse} from 'types'
import {RegionModel, RegionRepository} from 'data'
import {apiAction} from 'utils/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<RegionModel[]>>,
) {
  return apiAction(req, res, 'fetch regions').run<string>((org) =>
    RegionRepository.default.fromOrg(org),
  )
}
