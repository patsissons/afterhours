import {PropsWithChildren} from 'react'

import {AppContext, AppFrame} from './components'

export function App({children}: PropsWithChildren) {
  return (
    <AppContext>
      <AppFrame>{children}</AppFrame>
    </AppContext>
  )
}
