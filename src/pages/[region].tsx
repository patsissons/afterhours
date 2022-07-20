import {GetServerSidePropsContext, GetServerSidePropsResult} from 'next'
import {RegionPage, Props} from 'containers/RegionPage'
import {EventRepository, RegionRepository} from 'data'
import {hostWithoutOrg, orgForHost} from 'utils/url'
import {logging} from 'utils/logging'
import {PageProps} from 'types'

export default RegionPage

export async function getServerSideProps({
  query,
  req,
  resolvedUrl,
}: GetServerSidePropsContext): Promise<
  GetServerSidePropsResult<PageProps<Props>>
> {
  try {
    const {host} = req.headers

    if (!host) {
      // this should never happen
      return {
        notFound: true,
      }
    }

    const org = orgForHost(host)

    if (!org) {
      return {
        redirect: {
          permanent: false,
          destination: hostWithoutOrg(host),
        },
      }
    }

    const regions = await RegionRepository.default.fromOrg(org)
    const name = resolvedUrl.replace(/^\//, '')
    const region = await RegionRepository.default.fromName(org, name)

    if (!region) {
      return {
        props: {
          org,
          regions,
          region: name,
        },
      }
    }

    const events = await EventRepository.default.fromRegion(org, name, {
      deleted: Boolean('deleted' in query),
      skip: Number(query.skip || 0),
    })

    return {
      props: {
        org,
        regions,
        region,
        events,
      },
    }
  } catch (error: any) {
    logging.error(error)
    return {
      props: {
        error: error.toString(),
      },
    }
  }
}
