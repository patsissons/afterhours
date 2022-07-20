import {Banner, Card, Collapsible} from '@shopify/polaris'
import {useI18n} from '@shopify/react-i18n'
import type {RegionalEventModel, RegionModel} from 'data'
import {useCallback, useState} from 'react'

import {RegionEventForm, RegionEventSection} from './components'

export interface Props {
  region: RegionModel
  events: RegionalEventModel[]
}

export function OrgRegion({region, events}: Props) {
  const {
    details: {displayName},
  } = region

  const [i18n] = useI18n()
  const [formVisible, setFormVisible] = useState(false)

  const toggleForm = useCallback(() => {
    setFormVisible((value) => !value)
  }, [])

  return (
    <Card
      title={i18n.translate('title', {count: events.length})}
      actions={[
        {
          content: formVisible ? 'Hide event form' : 'Show create event form',
          onAction: toggleForm,
        },
      ]}
    >
      {renderForm()}
      {renderEvents()}
    </Card>
  )

  function renderForm() {
    if (!formVisible) {
      return null
    }

    return (
      <Card.Section title={i18n.translate('form.title')}>
        <Collapsible id="new-event-form" open={formVisible}>
          <RegionEventForm />
        </Collapsible>
      </Card.Section>
    )
  }

  function renderEvents() {
    if (events.length === 0) {
      return (
        <Card.Section>
          <Banner title="No events yet" status="info" action={bannerAction()}>
            <p>{i18n.translate('banner.content', {region: displayName})}</p>
          </Banner>
        </Card.Section>
      )
    }

    return events.map((event) => {
      return <RegionEventSection key={event.id} event={event} />
    })

    function bannerAction() {
      if (formVisible) {
        return undefined
      }

      return {
        content: 'Add new event',
        onAction: toggleForm,
      }
    }
  }
}
