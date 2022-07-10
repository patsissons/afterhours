import {isDevelopment} from './env'

export const hostUtils = {
  parse(host: string) {
    const match = pattern().exec(host)

    if (!match?.groups) {
      return {matched: false as const}
    }

    const {org} = match.groups

    return {matched: true as const, org}

    function pattern() {
      return isDevelopment
        ? /^(?<org>[^.]+)\.(?<domain>localhost)(?<port>:\d+)?$/
        : /^(?<org>[^.]+)\.(?<domain>afterhours)\.(?<tld>place)(?<port>:\d+)?$/
    }
  },
}
