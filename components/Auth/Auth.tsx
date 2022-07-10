import {useAuth} from 'hooks/auth'
import {useAuthOrg} from 'hooks/region'
import {signIn, signOut} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {isDevelopment} from 'utils/env'
import {hostUtils} from 'utils/host'

export function Auth() {
  const {user} = useAuth()
  const authOrg = useAuthOrg()
  const [orgUri, setOrgUri] = useState<string>()
  const router = useRouter()

  const token = isDevelopment && router.query.token

  useEffect(() => {
    if (!token) {
      return
    }

    document.cookie = `next-auth.session-token=${token}`
  }, [token])

  const isUnauthenticated = user == null

  useEffect(() => {
    if (isUnauthenticated && orgUri) {
      setOrgUri(undefined)
    }
  }, [isUnauthenticated, orgUri])

  useEffect(() => {
    if (!authOrg) {
      return
    }

    const {protocol, host} = window.location
    const hostInfo = hostUtils.parse(host)

    if (hostInfo.matched && hostInfo.org === authOrg) {
      return
    }

    let uri = `${protocol}//${authOrg}.${host}`

    if (isDevelopment) {
      const cookie = document.cookie
        .split(';')
        .find((entry) => entry.startsWith('next-auth.session-token='))

      if (cookie) {
        const [, token = ''] = cookie.split('=')
        uri += `?token=${token}`
      }
    }

    setOrgUri(uri)
  }, [authOrg])

  return (
    <div>
      <button type="button" onClick={handleAuth}>
        Sign {user ? 'out' : 'in'}
      </button>
      <div>{authOrg && orgUri && <a href={orgUri}>{authOrg}</a>}</div>
    </div>
  )

  function handleAuth() {
    if (user) {
      signOut()
    } else {
      signIn()
    }
  }
}
