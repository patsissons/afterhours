import {
  Banner,
  Card,
  Collapsible,
  DisableableAction,
  LoadableAction,
} from '@shopify/polaris'
import {useI18n} from '@shopify/react-i18n'
import {useCallback, useState} from 'react'
import {useRegions} from 'hooks/regions'

import {RegionForm, RegionSection} from './components'

export interface Props {
  org: string
}

export function Org({org}: Props) {
  const [i18n] = useI18n()
  const {regions} = useRegions()
  const [formVisible, setFormVisible] = useState(false)

  const toggleForm = useCallback(() => {
    setFormVisible((value) => !value)
  }, [])

  return (
    <Card
      title={i18n.translate('title', {count: regions.length})}
      actions={[
        {
          content: formVisible ? 'Hide region form' : 'Show create region form',
          onAction: toggleForm,
        },
      ]}
    >
      {renderForm()}
      {renderRegions()}
    </Card>
  )

  function renderForm() {
    if (!formVisible) {
      return null
    }

    return (
      <Card.Section title={i18n.translate('form.title')}>
        <Collapsible id="region-form" open={formVisible}>
          <RegionForm org={org} />
        </Collapsible>
      </Card.Section>
    )
  }

  function renderRegions() {
    if (regions.length === 0) {
      return (
        <Card.Section>
          <Banner title="No regions yet" status="info" action={bannerAction()}>
            <p>{i18n.translate('banner.content', {org})}</p>
          </Banner>
        </Card.Section>
      )
    }

    return regions.map((region) => {
      return <RegionSection key={region.id} region={region} />
    })

    function bannerAction(): (DisableableAction & LoadableAction) | undefined {
      if (formVisible) {
        return undefined
      }

      return {
        content: 'Add new region',
        onAction: toggleForm,
      }
    }
  }
}
