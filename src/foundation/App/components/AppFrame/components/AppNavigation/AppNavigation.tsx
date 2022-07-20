import {Navigation} from '@shopify/polaris'
import {HomeMajor, DomainsMajor, LocationsMinor} from '@shopify/polaris-icons'
import {useI18n} from '@shopify/react-i18n'
import {useRouter} from 'next/router'
import {useAuthOrg, useAuthOrgUri} from 'hooks/auth'
import {useHost} from 'hooks/url'
import {hostWithoutOrg} from 'src/utils/url'
import {useRegions} from 'hooks/regions'

export function AppNavigation() {
  const {pathname} = useRouter()
  const [i18n] = useI18n()
  const authOrg = useAuthOrg()
  const authOrgUri = useAuthOrgUri()
  const {org, host, protocol} = useHost()
  const {regions} = useRegions()

  if (!host) {
    return null
  }

  const isAuthOrg = org === authOrg

  return (
    <Navigation location={pathname}>
      <Navigation.Section
        items={[
          {
            url: `${protocol}//${hostWithoutOrg(host)}`,
            label: i18n.translate('AppNavigation.home'),
            icon: HomeMajor,
            exactMatch: true,
            matches: Boolean(!org && pathname === '/'),
          },
        ]}
      />
      {authOrg && authOrgUri && (
        <Navigation.Section
          separator
          items={[
            {
              url: authOrgUri,
              label: authOrg,
              icon: DomainsMajor,
              matches: isAuthOrg && pathname === '/',
            },
            ...regions.map(({name, details: {displayName}}) => ({
              url: `/${name}`,
              label: displayName,
              icon: LocationsMinor,
              matches: isAuthOrg && pathname === `/${name}`,
            })),
          ]}
        />
      )}
    </Navigation>
  )
}
