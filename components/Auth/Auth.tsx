import {signIn, signOut, useSession} from 'next-auth/react'

export function Auth() {
  const {data: session} = useSession()

  return (
    <button type="button" onClick={handleAuth}>
      Sign {session ? 'out' : 'in'}
    </button>
  )

  function handleAuth() {
    if (session) {
      signOut()
    } else {
      signIn()
    }
  }
}
