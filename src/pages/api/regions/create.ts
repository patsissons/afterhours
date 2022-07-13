import type {NextApiRequest, NextApiResponse} from 'next'
import {ResultOrError} from 'types'
import {Region, RegionModel, RegionRepository} from 'data'

export type Body = Region
export type Payload = ResultOrError<RegionModel>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>,
) {
  try {
    const body = JSON.parse(req.body) as Body

    const result = await RegionRepository.default.create(body)

    if ('error' in result) {
      res.status(500).json({
        error: {
          message: 'unable to create region',
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
