import {Banner, Card} from '@shopify/polaris'

export interface Props {
  region: string
}

export function RegionNotFound({region}: Props) {
  return (
    <Card title="Region not found" sectioned>
      <Banner
        title={`${region} region does not exist`}
        status="critical"
        action={{content: 'Create a new region', url: '/'}}
      />
    </Card>
  )
}
