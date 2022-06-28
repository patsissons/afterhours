export const hostUtils = {
  parse(host: string) {
    const match = /^(?:(?<region>[^.]+)\.)?(?<org>[^.]+)\.(?<domain>afterhours)\.(?<tld>[^.:]+)(?<port>:\d+)?$/.exec(host)

    if (!match?.groups) {
      return {matched: false as const}
    }

    const {region = undefined, org, tld} = match.groups

    return {matched: true as const, region, org, tld}
  },
}
