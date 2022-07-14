import type {NextApiRequest, NextApiResponse} from 'next'
import {
  EventRepository,
  RegionalEvent,
  RegionalEventModel,
  RegionRepository,
} from 'data'
import {ApiError, ApiResponse} from 'types'
import {apiAction} from 'utils/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<RegionalEventModel>>,
) {
  return apiAction(req, res, 'create event').run<RegionalEvent>(
    async ({date, details, org, region}) => {
      const model = await RegionRepository.default.fromName(org, region)

      if (!model) {
        throw new ApiError(`region ${region} not found for ${org}`)
      }

      return EventRepository.default.create({
        date,
        details,
        org,
        region,
      })
    },
  )
}
