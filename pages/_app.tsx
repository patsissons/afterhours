import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function AfterhoursApp({ Component, pageProps, router }: AppProps) {
  return <Component {...pageProps} router={router} />
}
