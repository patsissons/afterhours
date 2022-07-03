import regionList from './regions.json'

export interface Region {
  name: string
  org: string
}

export const orgRegionMap = regionList.reduce((map, region) => {
  let regions = map.get(region.org)

  if (!regions) {
    regions = new Map<string, Region>()
    map.set(region.org, regions)
  }

  regions.set(region.name, region)

  return map
}, new Map<string, Map<string, Region>>())

export const frozenRecords = {
  regionNames(orgName: string) {
    const regions = orgRegionMap.get(orgName)

    return regions && Array.from(regions.values())
  },
  region(orgName: string, regionName: string) {
    return orgRegionMap.get(orgName)?.get(regionName)
  },
}
