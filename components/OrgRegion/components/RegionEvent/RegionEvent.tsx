import type {RegionalEvent} from 'data'
import {JsonData} from 'components/JsonData'

export interface Props extends RegionalEvent {}

export function RegionEvent(props: Props) {
  return <JsonData data={props} />
}
