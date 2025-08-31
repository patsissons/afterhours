import type {AppProps} from 'next/app'
import {Session} from 'next-auth'
import {SessionProvider} from 'next-auth/react'
import 'styles/globals.css'

export default function AfterhoursApp({
  Component,
  pageProps: {session, ...pageProps},
}: AppProps<{session: Session}>) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
