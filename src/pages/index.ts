import {GetServerSidePropsContext, GetServerSidePropsResult} from 'next'
import {OrgPage, Props} from 'containers/OrgPage'
import {RegionRepository} from 'data'
import {orgForHost} from 'utils/url'
import {logging} from 'utils/logging'
import {PageProps} from 'types'

export {OrgPage as default}

export async function getServerSideProps({
  req,
}: GetServerSidePropsContext): Promise<
  GetServerSidePropsResult<PageProps<Props>>
> {
  try {
    const host = req.headers.host

    if (!host) {
      // this should never happen
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
