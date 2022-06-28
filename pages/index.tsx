import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import { ComponentPropsWithoutRef } from 'react'

import { Error } from '../components/Error'
import { Frame } from '../components/Frame'
import { Org } from '../components/Org'
import { Page } from '../components/Page'
import { frozenRecords } from '../data/frozen'
import { hostUtils } from '../utils/host'

export type Props =
  | ComponentPropsWithoutRef<typeof Error>
  | ComponentPropsWithoutRef<typeof Org>

export default function OrgPage(props: Props) {
  const router = useRouter()

  if ('error' in props) {
    return (
      <Frame>
        <Page title="Error">
          <Error error={props.error} />
        </Page>
      </Frame>
    )
  }

  if ('regions' in props) {
    const org = props.org
    return (
      <Frame title={`${org} Afterhours`}>
        <Page title={`${org} Afterhours regions`} description="Click on a region to see the events">
          <Org org={org} regions={props.regions} />
        </Page>
      </Frame>
    )
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
  try {
    const host = context.req.headers.host

    if (!host) {
      return {
        notFound: true,
      }
    }

    const hostInfo = hostUtils.parse(host)

    if (!hostInfo.matched) {
      return {
        notFound: true,
      }
    }

    const {org} = hostInfo
    const regions = frozenRecords.regionNames(org)

    if (!regions) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        org,
        regions,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        error,
      },
    }
  }
}
