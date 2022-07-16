import {useRouter} from 'next/router'
import {ComponentPropsWithoutRef} from 'react'
import {Error} from 'components/Error'
import {AppPage} from 'components/AppPage'
import {logging} from 'utils/logging'
import {api} from 'src/utils/api'

import {OrgRegion} from './components'

export type Props =
  | ComponentPropsWithoutRef<typeof Error>
  | ComponentPropsWithoutRef<typeof OrgRegion>

export function RegionPage(props: Props) {
  const router = useRouter()

  if ('error' in props) {
    return (
      <AppPage title="Error">
        <Error error={props.error} />
      </AppPage>
    )
  }

  if ('events' in props) {
    const {org, region} = props
    const displayRegion = region.toUpperCase()

    return (
      <AppPage
        title={`${displayRegion} afterhours`}
        description={`${org} events for ${displayRegion}`}
      >
        <input type="text" id="event-id" />
        <button
          type="button"
          onClick={() => {
            handleCreate({
              date: new Date().toISOString(),
              org,
              region,
              details: {
                location: {
                  name: 'testing',
                },
              },
            })
          }}
        >
          create test event
        </button>
        <button
          type="button"
          onClick={() => {
            const id = eventIdElement()

            if (id) {
              const event = props.events.find((event) => event.id === id.value)

              if (event) {
                handleUpdate(event)
                id.value = ''
              }
            }
          }}
        >
          update by id
        </button>
        <button
          type="button"
          onClick={() => {
            const id = eventIdElement()

            if (id) {
              handleDelete(id.value)
              id.value = ''
            }
          }}
        >
          delete by id
        </button>
        <OrgRegion org={org} region={props.region} events={props.events} />
      </AppPage>
    )
  }

  function eventIdElement() {
    return document.getElementById('event-id') as HTMLInputElement | null
  }

  async function handleCreate(event: any) {
    await api('events/create', event)
    router.replace(router.asPath)
  }

  async function handleUpdate(event: any) {
    const update = {
      ...event,
      date: new Date().toISOString(),
      details: {
        ...event.details,
        notes: 'updated!',
      },
      deleted: false,
    }
    await api('events/update', update)
    router.replace(router.asPath)
  }

  async function handleDelete(id: string) {
    const res = await fetch('/api/events/delete', {
      method: 'POST',
      body: JSON.stringify({id}),
    })
    const result = await res.json()
    logging.info('event deleted', result)
    router.replace(router.asPath)
  }
}
