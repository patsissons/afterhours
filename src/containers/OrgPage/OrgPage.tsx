import {ComponentPropsWithoutRef} from 'react'
import {AppPage} from 'components/AppPage'
import {EmptyProps} from 'types'
import {RegionsProvider} from 'hooks/regions/provider'
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
    const {org, regions} = props
    return (
      <AppPage
        title={`${org} afterhours regions`}
        description="Click on a region to see the events"
      >
        <RegionsProvider regions={regions}>
          <Org org={org} />
        </RegionsProvider>
      </AppPage>
    )
  }

  return (
    <AppPage title="afterhours">
      <Landing />
    </AppPage>
  )
}
