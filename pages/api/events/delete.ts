import type { NextApiRequest, NextApiResponse } from 'next'
import { EventRepository } from '../../../data/events'
import { RegionalEvent } from '../../../types/events'

export type Body = {id: string}
export type Payload = RegionalEvent | {error: any}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  try {
    const body = JSON.parse(req.body) as Body;
    const {id} = body

    if (!id) {
      res.status(500).json({
        error: {
          message: 'invalid body',
          body: req.body,
          parsed: body,
        },
      })
      return
    }

    const result = await EventRepository.default.delete(id)

    if ('error' in result) {
      res.status(500).json({
        error: {
          message: 'unable to delete',
          body: req.body,
          result: result.error,
        },
      })
      return
    }

    res.status(200).json(result.value)
  } catch (error: any) {
    console.log('delete error', error)
    res.status(500).json({
      error: error.toString(),
    })
  }
}
