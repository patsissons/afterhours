import type {AppProps} from 'next/app'
import {SessionProvider} from 'next-auth/react'
import {App} from 'foundation'
import {AppPage} from 'components/AppPage'
import {Error} from 'components/Error'

import 'styles/globals.css'
import '@shopify/polaris/build/esm/styles.css'

export default function AfterhoursApp({
  Component,
  pageProps: {session, ...props},
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <App>{renderComponent()}</App>
    </SessionProvider>
  )

  function renderComponent() {
    if ('error' in props) {
      return (
        <AppPage title="Error">
          <Error error={props.error} />
        </AppPage>
      )
    }

    return <Component {...props} />
  }
}
