import {useContext} from 'react'

import {RegionsContext} from './context'

export function useRegions() {
  const value = useContext(RegionsContext)

  if (!value) {
    throw new Error('missing <RegionsContext />')
  }

  return value
}
