export const hostUtils = {
  parse(host: string) {
    const match =
      /^(?<org>[^.]+)\.(?<domain>afterhours)\.(?<tld>[^.:]+)(?<port>:\d+)?$/.exec(
        host,
      )

    if (!match?.groups) {
      return {matched: false as const}
    }

    const {org, tld} = match.groups

    return {matched: true as const, org, tld}
  },
}
