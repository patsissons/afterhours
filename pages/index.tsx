import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import { ComponentPropsWithoutRef, useCallback } from 'react'

import { Error } from '../components/Error'
import { Frame } from '../components/Frame'
import { Org } from '../components/Org'
import { OrgRegion } from '../components/OrgRegion'
import { Page } from '../components/Page'
import { EventRepository } from '../data/events'
import { frozenRecords } from '../data/frozen'
import { hostUtils } from '../utils/host'

export type Props =
  | ComponentPropsWithoutRef<typeof Error>
  | ComponentPropsWithoutRef<typeof Org>
  | ComponentPropsWithoutRef<typeof OrgRegion>

export default function Home(props: Props) {
  const router = useRouter()

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
      <Frame title={`${org} Afterhours`}>
        <Page title={`${org} Afterhours regions`} description="Click on a region to see the events">
          <Org org={org} regions={props.regions} />
        </Page>
      </Frame>
    )
  }

  if ('events' in props) {
    const {org, region} = props
    const displayRegion = region.toUpperCase()

    return (
      <Frame title={`${org} ${displayRegion} Afterhours`}>
        <Page title={`${displayRegion} Afterhours`} description={`${org} events for ${displayRegion}`}>
          <input type="text" id="event-id" />
          <button type="button" onClick={() => {
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
          }}>
            create test event
          </button>
          <button type="button" onClick={() => {
            const id = eventIdElement()

            if (id) {
              const event = props.events.find((event) => event.id === id.value)

              if (event) {
                handleUpdate(event)
                id.value = ''
              }
            }
          }}>
            update by id
          </button>
          <button type="button" onClick={() => {
            const id = eventIdElement()

            if (id) {
              handleDelete(id.value)
              id.value = ''
            }
          }}>
            delete by id
          </button>
          <OrgRegion org={org} region={props.region} events={props.events} />
        </Page>
      </Frame>
    )
  }

  function eventIdElement() {
    return document.getElementById('event-id') as HTMLInputElement | null
  }

  async function handleCreate(event: any) {
    const res = await fetch('/api/events/create', {method: 'POST', body: JSON.stringify(event)})
    const result = await res.json()
    console.log('create', {event, result})
    router.replace(router.asPath)
  }

  async function handleUpdate(event: any) {
    const update = {
      ...event,
      date: new Date().toISOString(),
      details: {
        ...event.details,
        notes: "updated!",
      },
      deleted: false,
    }
    const res = await fetch('/api/events/update', {method: 'POST', body: JSON.stringify(update)})
    const result = await res.json()
    console.log('delete', {update, result})
    router.replace(router.asPath)
  }

  async function handleDelete(id: string) {
    const res = await fetch('/api/events/delete', {method: 'POST', body: JSON.stringify({id})})
    const result = await res.json()
    console.log('delete', {id, result})
    router.replace(router.asPath)
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
  try {
    const host = context.req.headers.host

    if (!host) {
      return {
        notFound: true,
      }
    }

    const hostInfo = hostUtils.parse(host)

    if (!hostInfo.matched) {
      return {
        notFound: true,
      }
    }

    const {region: regionName, org} = hostInfo

    if (!regionName) {
      const regions = frozenRecords.regionNames(org)
      return {
        props: {
          org,
          regions,
        },
      }
    }

    const region = frozenRecords.region(org, regionName)

    if (!region) {
      return {
        notFound: true,
      }
    }

    const events = await EventRepository.default
      .fromRegion(org, regionName, {
        deleted: Boolean('deleted' in context.query),
        skip: Number(context.query.skip || 0),
      })

    console.log('events', events)

    return {
      props: {
        org,
        region: regionName,
        events,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        error,
      },
    }
  }
}
