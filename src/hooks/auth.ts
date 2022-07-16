import {signOut, useSession} from 'next-auth/react'
import {useEffect, useState} from 'react'
import {logging} from 'utils/logging'

interface User {
  email: string
  name?: string
  image?: string
}

export function useAuth() {
  const [user, setUser] = useState<User>()
  const {data, status} = useSession()

  const isUnauthenticated = status === 'unauthenticated'

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
  }, [status, data?.user?.email])

  if (!data || status !== 'authenticated') {
    return {status}
  }

  const {expires} = data

  return {
    status,
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
