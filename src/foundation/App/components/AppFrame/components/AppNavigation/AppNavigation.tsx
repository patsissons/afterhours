import {Navigation} from '@shopify/polaris'
import {HomeMajor, FavoriteMajor} from '@shopify/polaris-icons'
import {useI18n} from '@shopify/react-i18n'
import {useRouter} from 'next/router'
import {useAuthOrg, useAuthOrgUri} from 'hooks/auth'
import {useHost} from 'hooks/url'
import {hostWithoutOrg} from 'src/utils/url'

export function AppNavigation() {
  const {pathname} = useRouter()
  const [i18n] = useI18n()
  const authOrg = useAuthOrg()
  const authOrgUri = useAuthOrgUri()
  const {org, host, protocol} = useHost()

  if (!host) {
    return null
  }

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
          items={[
            {
              url: authOrgUri,
              label: authOrg,
              icon: FavoriteMajor,
              matches: Boolean(org === authOrg),
            },
          ]}
        />
      )}
    </Navigation>
  )
}
