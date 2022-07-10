import {useAuth} from './auth'

export function useAuthOrg() {
  const {user} = useAuth()

  if (!user) {
    return undefined
  }

  const match = /@(?<org>[^.]+)\./.exec(user.email)

  return match?.groups?.org
}
