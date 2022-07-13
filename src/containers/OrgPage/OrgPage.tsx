import {ComponentPropsWithoutRef} from 'react'
import {Error} from 'components/Error'
import {Frame, Page} from 'foundation'
import {EmptyProps} from 'types'

import {Auth, Org} from './components'

export type Props =
  | EmptyProps
  | ComponentPropsWithoutRef<typeof Error>
  | ComponentPropsWithoutRef<typeof Org>

export function OrgPage(props: Props) {
  if ('error' in props) {
    return (
      <Frame>
        <Page title="Error">
          <Error error={props.error} />
        </Page>
      </Frame>
    )
  }

  if ('regions' in props) {
    const org = props.org
    return (
      <Frame title={`${org} afterhours`}>
        <Page
          title={`${org} afterhours regions`}
          description="Click on a region to see the events"
        >
          <Org org={org} regions={props.regions} />
        </Page>
      </Frame>
    )
  }

  return (
    <Frame>
      <Page title="afterhours">
        <Auth />
      </Page>
    </Frame>
  )
}
