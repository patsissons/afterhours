import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {isDevelopment} from 'utils/env'

export function useDevelopmentSessionToken() {
  const router = useRouter()
  const token = isDevelopment && router.query.token

  useEffect(() => {
    if (!token) {
      return
    }

    document.cookie = `next-auth.session-token=${token}`
  }, [token])
}
