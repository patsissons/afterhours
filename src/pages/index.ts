import {GetServerSidePropsContext, GetServerSidePropsResult} from 'next'
import {OrgPage, Props} from 'containers/OrgPage'
import {RegionRepository} from 'data'
import {orgForHost} from 'utils/host'
import {logging} from 'utils/logging'

export {OrgPage as default}

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

    const org = orgForHost(host)

    if (!org) {
      return {
        props: {},
      }
    }

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
