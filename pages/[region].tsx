import {GetServerSidePropsContext, GetServerSidePropsResult} from 'next'
import {useRouter} from 'next/router'
import {ComponentPropsWithoutRef} from 'react'
import {Error} from 'components/Error'
import {Frame} from 'components/Frame'
import {OrgRegion} from 'components/OrgRegion'
import {Page} from 'components/Page'
import {EventRepository} from 'data/events'
import {frozenRecords} from 'data/frozen'
import {hostUtils} from 'utils/host'
import {logging} from 'utils/logging'

export type Props =
  | ComponentPropsWithoutRef<typeof Error>
  | ComponentPropsWithoutRef<typeof OrgRegion>

export default function RegionPage(props: Props) {
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

  if ('events' in props) {
    const {org, region} = props
    const displayRegion = region.toUpperCase()

    return (
      <Frame title={`${org} ${displayRegion} Afterhours`}>
        <Page
          title={`${displayRegion} Afterhours`}
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
                const event = props.events.find(
                  (event) => event.id === id.value,
                )

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
        </Page>
      </Frame>
    )
  }

  function eventIdElement() {
    return document.getElementById('event-id') as HTMLInputElement | null
  }

  async function handleCreate(event: any) {
    const res = await fetch('/api/events/create', {
      method: 'POST',
      body: JSON.stringify(event),
    })
    const result = await res.json()
    logging.info('event created', result)
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
    const res = await fetch('/api/events/update', {
      method: 'POST',
      body: JSON.stringify(update),
    })
    const result = await res.json()
    logging.info('event updated', result)
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

export async function getServerSideProps({
  query,
  req,
  resolvedUrl,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  try {
    const {host} = req.headers

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

    const {org} = hostInfo
    const regions = frozenRecords.regionNames(org)

    if (!regions) {
      return {
        notFound: true,
      }
    }

    const regionName = resolvedUrl.replace(/^\//, '')
    const region = frozenRecords.region(org, regionName)

    if (!region) {
      return {
        notFound: true,
      }
    }

    const events = await EventRepository.default.fromRegion(org, regionName, {
      deleted: Boolean('deleted' in query),
      skip: Number(query.skip || 0),
    })

    return {
      props: {
        org,
        region: regionName,
        events,
      },
    }
  } catch (error: any) {
    logging.error(error)
    return {
      props: {
        error: error.toString(),
      },
    }
  }
}
