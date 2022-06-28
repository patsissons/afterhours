import { PropsWithChildren, ReactNode } from "react";

import styles from './Page.module.css'

export interface Props {
  title: ReactNode
  description?: ReactNode
}

export function Page({title, children, description}: PropsWithChildren<Props>) {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </main>
  )
}
