import {signIn, signOut, useSession} from 'next-auth/react'
import {useCallback, useEffect, useState} from 'react'
import {isDevelopment} from 'utils/env'
import {hostWithOrg, sessionToken} from 'utils/url'
import {logging} from 'utils/logging'

import {useHost} from './url'

export interface User {
  email: string
  name?: string
  image?: string
}

export interface Auth {
  status: 'authenticated' | 'loading' | 'unauthenticated'
  authAction(): void
  user?: User
  expires?: string
}

export function useAuth(): Auth {
  const [user, setUser] = useState<User>()
  const {data, status} = useSession()

  const isUnauthenticated = status === 'unauthenticated'

  const authAction = useCallback(() => {
    if (user) {
      signOut()
    } else {
      signIn()
    }
  }, [user])

  useEffect(() => {
    if (isUnauthenticated && user) {
      setUser(undefined)
    }
  }, [isUnauthenticated, user])

  useEffect(() => {
    if (status !== 'authenticated') {
      return
    }

    if (data?.user?.email) {
      setUser(data.user as User)
    } else {
      logging.error('invalid auth state', {data, status})
      signOut()
    }
  }, [status, data])

  const baseAuth = {status, authAction}

  if (!data || status !== 'authenticated') {
    return baseAuth
  }

  const {expires} = data

  return {
    ...baseAuth,
    expires,
    user,
  }
}

export function useAuthOrg() {
  const {user} = useAuth()

  if (!user) {
    return undefined
  }

  const match = /@(?<org>[^.]+)\./.exec(user.email)

  return match?.groups?.org
}

export function useAuthOrgUri() {
  const org = useAuthOrg()
  const {protocol, host} = useHost()
  const [orgUri, setOrgUri] = useState<string>()

  useEffect(() => {
    if (host && org && protocol) {
      const orgHost = hostWithOrg(host, org)
      const orgUri = `${protocol}//${orgHost}`

      if (isDevelopment) {
        const token = sessionToken()

        setOrgUri(`${orgUri}?token=${token}`)
      } else {
        setOrgUri(orgUri)
      }
    } else {
      setOrgUri(undefined)
    }
  }, [host, org, protocol])

  return orgUri
}
