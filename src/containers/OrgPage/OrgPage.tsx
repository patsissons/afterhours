import {ComponentPropsWithoutRef} from 'react'
import {Error} from 'components/Error'
import {AppPage} from 'components/AppPage'
import {EmptyProps} from 'types'

import {Auth, Org} from './components'

export type Props =
  | EmptyProps
  | ComponentPropsWithoutRef<typeof Error>
  | ComponentPropsWithoutRef<typeof Org>

export function OrgPage(props: Props) {
  if ('error' in props) {
    return (
      <AppPage title="Error">
        <Error error={props.error} />
      </AppPage>
    )
  }

  if ('regions' in props) {
    const org = props.org
    return (
      <AppPage
        title={`${org} afterhours regions`}
        description="Click on a region to see the events"
      >
        <Org org={org} regions={props.regions} />
      </AppPage>
    )
  }

  return (
    <AppPage title="afterhours">
      <Auth />
    </AppPage>
  )
}
