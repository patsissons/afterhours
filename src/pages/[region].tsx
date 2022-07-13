import {GetServerSidePropsContext, GetServerSidePropsResult} from 'next'
import {RegionPage, Props} from 'containers/RegionPage'
import {EventRepository, RegionRepository} from 'data'
import {orgForHost} from 'utils/host'
import {logging} from 'utils/logging'

export default RegionPage

export async function getServerSideProps({
  query,
  req,
  resolvedUrl,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  try {
    const {host} = req.headers

    if (!host) {
      return {
        notFound: true,
      }
    }

    const org = orgForHost(host)

    if (!org) {
      return {
        notFound: true,
      }
    }

    const name = resolvedUrl.replace(/^\//, '')
    const region = await RegionRepository.default.fromName(org, name)

    if (!region) {
      return {
        notFound: true,
      }
    }

    const events = await EventRepository.default.fromRegion(org, name, {
      deleted: Boolean('deleted' in query),
      skip: Number(query.skip || 0),
    })

    return {
      props: {
        org,
        region: name,
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
