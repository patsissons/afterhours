import {ComponentPropsWithoutRef} from 'react'
import {AppPage} from 'components/AppPage'
import {EmptyProps} from 'types'
import {RegionModel} from 'data'

import {Landing, Org} from './components'
import {useDevelopmentSessionToken} from './hooks'

export interface OrgProps extends ComponentPropsWithoutRef<typeof Org> {
  regions: RegionModel[]
}

export type Props = EmptyProps | OrgProps

export function OrgPage(props: Props) {
  useDevelopmentSessionToken()

  if ('org' in props) {
    const {org} = props

    return (
      <AppPage
        title={`${org} afterhours regions`}
        description="Click on a region to see the events"
      >
        <Org org={org} />
      </AppPage>
    )
  }

  return (
    <AppPage title="afterhours">
      <Landing />
    </AppPage>
  )
}
