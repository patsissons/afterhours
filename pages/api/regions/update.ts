import type {NextApiRequest, NextApiResponse} from 'next'
import {RegionModel, RegionRepository} from 'data'
import {ResultOrError} from 'types'

export type Body = RegionModel
export type Payload = ResultOrError<RegionModel>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>,
) {
  try {
    const body = JSON.parse(req.body) as Body
    const result = await RegionRepository.default.update(body)

    if ('error' in result) {
      res.status(500).json({
        error: {
          message: 'unable to update region',
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
