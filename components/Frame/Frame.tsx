import Head from 'next/head'
import {PropsWithChildren} from 'react'
import {Footer} from 'components/Footer'

import styles from './Frame.module.css'

export interface Props {
  title?: string
  description?: string
}

export function Frame({
  children,
  description,
  title = 'afterhours',
}: PropsWithChildren<Props>) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
      <Footer />
    </div>
  )
}
