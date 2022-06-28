import { RegionalEvent } from "../../../../types/events";
import { JsonData } from "../../../JsonData/JsonData";

export interface Props extends RegionalEvent {
}

export function RegionEvent(props: Props) {
  return <JsonData data={props} />
}
