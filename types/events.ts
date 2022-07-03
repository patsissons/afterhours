export interface RegionalEventDetails {
  location: {
    name: string
    coords?: string
    url?: string
  }
  notes?: string
}

export interface RegionalEvent {
  id: string
  org: string
  region: string
  date: string
  details: RegionalEventDetails
  deleted?: boolean
}
