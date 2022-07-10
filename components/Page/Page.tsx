import {useAuth} from 'hooks/auth'
import {PropsWithChildren, ReactNode} from 'react'

import styles from './Page.module.css'

export interface Props {
  title: ReactNode
  description?: ReactNode
}

export function Page({title, children, description}: PropsWithChildren<Props>) {
  const {user, status} = useAuth()

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      <p>{`[${status}] ${user?.email || ''}`}</p>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </main>
  )
}
