import type {NextApiRequest, NextApiResponse} from 'next'
import {ResultOrError} from 'types'
import {
  EventRepository,
  RegionalEvent,
  RegionalEventModel,
  RegionRepository,
} from 'data'

export type Body = RegionalEvent
export type Payload = ResultOrError<RegionalEventModel>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>,
) {
  try {
    const body = JSON.parse(req.body) as Body
    const {date, details} = body
    const region = await RegionRepository.default.fromName(
      body.org,
      body.region,
    )

    if (!region) {
      res.status(500).json({
        error: {
          message: 'invalid body',
          body: req.body,
          parsed: body,
        },
      })
      return
    }

    const result = await EventRepository.default.create({
      org: region.org,
      region: region.name,
      date,
      details,
    })

    if ('error' in result) {
      res.status(500).json({
        error: {
          message: 'unable to create event',
          body: req.body,
          result: result.error,
        },
      })
      return
    }

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      error,
    })
  }
}
