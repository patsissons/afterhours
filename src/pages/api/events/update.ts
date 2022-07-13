import type {NextApiRequest, NextApiResponse} from 'next'
import {EventRepository, RegionalEventModel} from 'data'
import {ResultOrError} from 'types'

export type Body = RegionalEventModel
export type Payload = ResultOrError<RegionalEventModel>

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

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      error,
    })
  }
}
