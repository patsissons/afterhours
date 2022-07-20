import {useRouter} from 'next/router'
import {ComponentPropsWithoutRef} from 'react'
import {AppPage} from 'components/AppPage'
import {logging} from 'utils/logging'
import {api} from 'utils/api'
import {useRegions} from 'src/hooks/regions'

import {OrgRegion, RegionNotFound} from './components'

export type Props =
  | ComponentPropsWithoutRef<typeof OrgRegion>
  | ComponentPropsWithoutRef<typeof RegionNotFound>

export function RegionPage(props: Props) {
  const {org} = useRegions()

  if ('events' in props) {
    const {
      region,
      events,
      region: {
        details: {displayName},
      },
    } = props

    return (
      <AppPage
        title={`${displayName} afterhours`}
        description={`${org} events for ${displayName}`}
      >
        <OrgRegion region={region} events={events} />
      </AppPage>
    )
  }

  return (
    <AppPage title="afterhours">
      <RegionNotFound {...props} />
    </AppPage>
  )

  // function eventIdElement() {
  //   return document.getElementById('event-id') as HTMLInputElement | null
  // }

  // async function handleCreate(event: any) {
  //   await api('events/create', event)
  //   router.replace(router.asPath)
  // }

  // async function handleUpdate(event: any) {
  //   const update = {
  //     ...event,
  //     date: new Date().toISOString(),
  //     details: {
  //       ...event.details,
  //       notes: 'updated!',
  //     },
  //     deleted: false,
  //   }
  //   await api('events/update', update)
  //   router.replace(router.asPath)
  // }

  // async function handleDelete(id: string) {
  //   const res = await fetch('/api/events/delete', {
  //     method: 'POST',
  //     body: JSON.stringify({id}),
  //   })
  //   const result = await res.json()
  //   logging.info('event deleted', result)
  //   router.replace(router.asPath)
  // }
}
