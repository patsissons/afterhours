import {isDevelopment} from './env'

export interface HostParts {
  org?: string
  domain: string
  tld?: string
  port?: string
}

export function hostParts(host: string): Partial<HostParts> {
  const match = pattern().exec(host)

  if (!match?.groups) {
    return {}
  }

  return match.groups

  function pattern() {
    return isDevelopment
      ? /^((?<org>[^.]+)\.)?(?<domain>localhost)(?<port>:\d+)?$/
      : /^((?<org>[^.]+)\.)?(?<domain>afterhours)\.(?<tld>place)(?<port>:\d+)?$/
  }
}

export function orgForHost(host: string) {
  const {org} = hostParts(host)

  return org
}

export function hostWithoutOrg(host: string) {
  const {domain, tld = '', port = ''} = hostParts(host)

  return `${[domain, tld].filter(Boolean).join('.')}${port}`
}

export function hostWithOrg(host: string, org: string) {
  return `${org}.${hostWithoutOrg(host)}`
}

export function sessionToken() {
  const cookie = document.cookie
    .split(';')
    .find((entry) => entry.startsWith('next-auth.session-token='))

  if (!cookie) {
    return undefined
  }

  const [, token] = cookie.split('=')

  return token
}
