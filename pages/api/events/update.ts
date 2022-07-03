import type {NextApiRequest, NextApiResponse} from 'next'
import {EventRepository} from 'data/events'
import {RegionalEvent} from 'types/events'

export type Body = RegionalEvent
export type Payload = RegionalEvent | {error: any}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>,
) {
  try {
    const body = JSON.parse(req.body) as Body
    const result = await EventRepository.default.update(body)

    if ('error' in result) {
      res.status(500).json({
        error: {
          message: 'unable to update event',
          body: req.body,
          parsed: body,
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
