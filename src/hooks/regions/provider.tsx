import {PropsWithChildren, useCallback, useMemo, useState} from 'react'
import {Region, RegionModel} from 'data'
import {api} from 'utils/api'
import {logging} from 'utils/logging'

import {RegionsContext} from './context'
import {RegionsContextType} from './types'

export interface Props {
  regions: RegionModel[]
}

export function RegionsProvider({
  children,
  regions: loadedRegions,
}: PropsWithChildren<Props>) {
  const [regions, setRegions] = useState(loadedRegions)

  const refresh = useCallback(async () => {
    try {
      const res = await api<RegionModel[]>('regions', {method: 'GET'})

      if ('error' in res) {
        throw res.error
      }

      setRegions(res.result)
    } catch (error: any) {
      logging.error('region refresh error', error)
    }
  }, [])

  const create = useCallback(async (data: Region) => {
    try {
      const res = await api<RegionModel>('regions/create', {data})

      if ('error' in res) {
        throw res.error
      }

      setRegions((regions) => [...regions, res.result])

      return res.result
    } catch (error: any) {
      logging.error('region refresh error', error)
      return {error}
    }
  }, [])

  const value = useMemo<RegionsContextType>(
    () => ({regions, refresh, create}),
    [refresh, regions, create],
  )

  return (
    <RegionsContext.Provider value={value}>{children}</RegionsContext.Provider>
  )
}
