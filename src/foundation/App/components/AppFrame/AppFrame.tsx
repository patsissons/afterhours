import {Frame} from '@shopify/polaris'
import {PropsWithChildren, useCallback, useState} from 'react'

import {AppNavigation, AppToasts, AppTopBar} from './components'
import {logo} from './logo'

export function AppFrame({children}: PropsWithChildren) {
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false)

  const toggleMobileNavigation = useCallback(() => {
    setMobileNavigationActive((value) => !value)
  }, [])
  const dismissMobileNavigation = useCallback(
    () => setMobileNavigationActive(false),
    [],
  )

  return (
    <Frame
      globalRibbon={renderGlobalRibbon()}
      logo={logo}
      onNavigationDismiss={dismissMobileNavigation}
      navigation={renderNavigation()}
      topBar={renderTopBar()}
      showMobileNavigation={mobileNavigationActive}
    >
      {children}
      <AppToasts />
    </Frame>
  )

  function renderGlobalRibbon() {
    return undefined
  }

  function renderNavigation() {
    return <AppNavigation />
  }

  function renderTopBar() {
    return <AppTopBar toggleMobileNavigation={toggleMobileNavigation} />
  }
}
