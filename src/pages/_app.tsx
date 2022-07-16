import type {AppProps} from 'next/app'
import {SessionProvider} from 'next-auth/react'
import {App} from 'foundation'

import 'styles/globals.css'
import '@shopify/polaris/build/esm/styles.css'

export default function AfterhoursApp({
  Component,
  pageProps: {session, ...pageProps},
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <App>
        <Component {...pageProps} />
      </App>
    </SessionProvider>
  )
}
