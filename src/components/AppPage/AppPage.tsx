import {Layout, Page, PageProps} from '@shopify/polaris'
// import {useAuth} from 'hooks/auth'
import Head from 'next/head'
import {PropsWithChildren} from 'react'

// import styles from './Page.module.css'

export interface Props extends PageProps {
  description?: string
}

export function AppPage({
  children,
  description,
  ...props
}: PropsWithChildren<Props>) {
  // const {user, status} = useAuth()

  return (
    <Page {...props}>
      <Head>
        <title>{props.title ?? 'afterhours'}</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout sectioned>{children}</Layout>
    </Page>
  )
  // return (
  //   <main className={styles.main}>
  //     <h1 className={styles.title}>{title}</h1>
  //     <p>{`[${status}] ${user?.email || ''}`}</p>
  //     {description && <p className={styles.description}>{description}</p>}
  //     {children}
  //   </main>
  // )
}
