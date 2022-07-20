import {ModelIdentifiable} from 'mongo-repository'
import {PropsWithChildren, useCallback, useMemo, useState} from 'react'
import {Region, RegionModel} from 'data'
import {api, ApiClientOptions} from 'utils/api'
import {logging} from 'utils/logging'

import {RegionsContext} from './context'
import {RegionsContextType} from './types'

const model = 'region'

export interface Props {
  org: string
  regions?: RegionModel[]
}

export function RegionsProvider({
  children,
  org,
  regions: loadedRegions = [],
}: PropsWithChildren<Props>) {
  const [regions, setRegions] = useState(loadedRegions)

  const fetch = useCallback(
    () => apiCall<RegionModel[]>(model, 'fetch', setRegions, {method: 'GET'}),
    [],
  )

  const create = useCallback(
    (data: Region) =>
      apiCall<RegionModel>(
        model,
        'create',
        (data) => setRegions((regions) => [data, ...regions]),
        {data},
      ),
    [],
  )

  const update = useCallback(
    (data: RegionModel) =>
      apiCall<RegionModel>(
        model,
        'update',
        (data) => {
          setRegions((regions) => [
            data,
            ...regions.filter(({id}) => id !== data.id),
          ])
        },
        {data},
      ),
    [],
  )

  const remove = useCallback(
    (data: ModelIdentifiable) =>
      apiCall<RegionModel>(
        model,
        'remove',
        (data) => {
          setRegions((regions) => regions.filter(({id}) => id !== data.id))
        },
        {data},
      ),
    [],
  )

  const value = useMemo<RegionsContextType>(
    () => ({org, regions, fetch, create, update, remove}),
    [org, regions, fetch, create, update, remove],
  )

  return (
    <RegionsContext.Provider value={value}>{children}</RegionsContext.Provider>
  )
}

async function apiCall<Result>(
  model: string,
  action: string,
  onSuccess: (res: Result) => void,
  options?: ApiClientOptions,
) {
  try {
    const res = await api<Result>(`${model}s/${action}`, options)

    if ('error' in res) {
      throw res.error
    }

    onSuccess(res.result)

    return res.result
  } catch (error: any) {
    logging.error(`${model} ${action} error`, error)
    return {error}
  }
}
