import type { NextApiRequest, NextApiResponse } from 'next'
import { RegionalEvent } from '../../../types/events'

import { frozenRecords } from '../../../data/frozen'
import { EventRepository } from '../../../data/events'

export type Body = Omit<RegionalEvent, 'id'>
export type Payload = RegionalEvent | {error: any}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  try {
    const body = JSON.parse(req.body) as Body;
    const {date, details} = body
    const region = frozenRecords.region(body.org, body.region)

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

    res.status(200).json(result.value)
  } catch (error) {
    res.status(500).json({
      error,
    })
  }
}
