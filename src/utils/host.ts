import {isDevelopment} from './env'

export function orgForHost(host: string) {
  const match = pattern().exec(host)

  if (!match?.groups) {
    return undefined
  }

  const {org} = match.groups

  return org

  function pattern() {
    return isDevelopment
      ? /^(?<org>[^.]+)\.(?<domain>localhost)(?<port>:\d+)?$/
      : /^(?<org>[^.]+)\.(?<domain>afterhours)\.(?<tld>place)(?<port>:\d+)?$/
  }
}
