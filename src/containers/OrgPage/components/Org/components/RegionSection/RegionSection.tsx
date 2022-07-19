import {RegionModel} from 'data'
import {JsonData} from 'components/JsonData'
import {useCallback, useState} from 'react'
import {Card} from '@shopify/polaris'

import {RegionForm} from '../RegionForm'

export interface Props {
  region: RegionModel
}

export function RegionSection({region}: Props) {
  const {
    details: {displayName},
    deleted,
  } = region
  const [formVisible, setFormVisible] = useState(false)
  const toggleForm = useCallback(() => setFormVisible((value) => !value), [])

  return (
    <Card.Section
      title={displayName}
      subdued={deleted}
      actions={[
        {content: formVisible ? 'Cancel' : 'Edit', onAction: toggleForm},
      ]}
    >
      {renderContent()}
    </Card.Section>
  )

  function renderContent() {
    if (formVisible) {
      return <RegionForm org={region.org} region={region} />
    }

    return <JsonData data={region} />
  }
}
