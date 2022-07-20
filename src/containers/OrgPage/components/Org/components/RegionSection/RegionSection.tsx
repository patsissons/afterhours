import {RegionModel} from 'data'
import {useCallback, useState} from 'react'
import {
  Button,
  Card,
  DescriptionList,
  Heading,
  Icon,
  Stack,
} from '@shopify/polaris'
import {DeleteMinor, ViewMinor} from '@shopify/polaris-icons'
import moment from 'moment'

import {RegionForm} from '../RegionForm'

export interface Props {
  region: RegionModel
}

export function RegionSection({region}: Props) {
  const {
    name,
    details: {displayName, visible},
    deleted,
  } = region
  const [formVisible, setFormVisible] = useState(false)
  const toggleForm = useCallback(() => setFormVisible((value) => !value), [])

  return (
    <Card.Section
      title={renderTitle()}
      subdued={deleted}
      actions={[
        {content: formVisible ? 'Cancel' : 'Edit', onAction: toggleForm},
      ]}
    >
      {renderContent()}
    </Card.Section>
  )

  function renderTitle() {
    return (
      <Stack alignment="center">
        <Stack.Item fill>
          <Heading>
            <Button disabled={formVisible} url={`/${name}`} plain>
              {displayName}
            </Button>
          </Heading>
        </Stack.Item>
        {deleted && (
          <Stack.Item>
            <Icon source={DeleteMinor} color="subdued" />
          </Stack.Item>
        )}
        {visible && (
          <Stack.Item>
            <Icon source={ViewMinor} color="subdued" />
          </Stack.Item>
        )}
      </Stack>
    )
  }

  function renderContent() {
    if (formVisible) {
      return <RegionForm org={region.org} region={region} />
    }

    // return <JsonData data={region} />
    return (
      <DescriptionList
        items={[
          {term: 'Name', description: region.name},
          {term: 'Display name', description: region.details.displayName},
          {term: 'Notes', description: region.details.notes},
          {
            term: 'Created',
            description: `${moment(region.created).format(
              'LL',
            )} (last modified ${moment(region.updated).fromNow()})`,
          },
        ]}
        spacing="tight"
      />
    )
  }
}
