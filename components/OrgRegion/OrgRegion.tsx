import type {RegionalEvent} from 'data'

import {RegionEvent} from './components'

export interface Props {
  org: string
  region: string
  events: (RegionalEvent & {id: string})[]
}

export function OrgRegion({events}: Props) {
  if (events.length > 0) {
    return (
      <>
        {events.map((event) => (
          <RegionEvent key={event.id} {...event} />
        ))}
      </>
    )
  }

  return <p>No events yet...</p>
}
