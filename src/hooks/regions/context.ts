import {createContext} from 'react'

import {RegionsContextType} from './types'

export const RegionsContext = createContext<RegionsContextType | undefined>(
  undefined,
)
