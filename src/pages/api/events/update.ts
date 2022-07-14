import type {NextApiRequest, NextApiResponse} from 'next'
import {EventRepository, RegionalEventModel} from 'data'
import {ApiResponse} from 'types'
import {apiAction} from 'utils/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<RegionalEventModel>>,
) {
  return apiAction(req, res, 'update event').run<RegionalEventModel>((input) =>
    EventRepository.default.update(input),
  )
}
