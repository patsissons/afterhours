import type {GetServerSidePropsContext, GetServerSidePropsResult} from 'next'
import {ComponentPropsWithoutRef} from 'react'
import {Auth} from 'components/Auth'
import {Error} from 'components/Error'
import {Frame} from 'components/Frame'
import {Org} from 'components/Org'
import {Page} from 'components/Page'
import {hostUtils} from 'utils/host'
import {logging} from 'utils/logging'
import {RegionRepository} from 'data'
import {EmptyProps} from 'types'

export type Props =
  | EmptyProps
  | ComponentPropsWithoutRef<typeof Error>
  | ComponentPropsWithoutRef<typeof Org>

export default function OrgPage(props: Props) {
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
      <Frame title={`${org} afterhours`}>
        <Page
          title={`${org} afterhours regions`}
          description="Click on a region to see the events"
        >
          <Org org={org} regions={props.regions} />
        </Page>
      </Frame>
    )
  }

  return (
    <Frame>
      <Page title="afterhours">
        <Auth />
      </Page>
    </Frame>
  )
}

export async function getServerSideProps({
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  try {
    const host = req.headers.host

    if (!host) {
      return {
        notFound: true,
      }
    }

    const hostInfo = hostUtils.parse(host)

    if (!hostInfo.matched) {
      return {
        props: {},
      }
    }

    const {org} = hostInfo
    const regions = await RegionRepository.default.fromOrg(org)

    return {
      props: {
        org,
        regions,
      },
    }
  } catch (error) {
    logging.error(error)
    return {
      props: {
        error,
      },
    }
  }
}
