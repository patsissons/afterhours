import type {NextApiRequest, NextApiResponse} from 'next'
import {ModelIdentifiable, RegionModel, RegionRepository} from 'data'
import {ResultOrError} from 'types'
import {logging} from 'utils/logging'

export type Body = ModelIdentifiable
export type Payload = ResultOrError<RegionModel>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>,
) {
  try {
    const body = JSON.parse(req.body) as Body
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

    const result = await RegionRepository.default.delete({id})

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

    res.status(200).json(result)
  } catch (error: any) {
    logging.error('delete error', error)
    res.status(500).json({
      error: error.toString(),
    })
  }
}
