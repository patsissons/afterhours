import {Navigation} from '@shopify/polaris'
import {HomeMajor} from '@shopify/polaris-icons'
import {useI18n} from '@shopify/react-i18n'
import {useRouter} from 'next/router'

export function AppNavigation() {
  const {pathname} = useRouter()
  const [i18n] = useI18n()

  return (
    <Navigation location={pathname}>
      <Navigation.Section
        items={[
          {
            url: '/',
            label: i18n.translate('AppNavigation.home'),
            // label: 'home',
            icon: HomeMajor,
            exactMatch: true,
          },
        ]}
      />
      <Navigation.Section
        items={
          [
            // {
            //   url: '/api',
            //   label: i18n.translate('AppNavigation.apiList'),
            //   icon: ListMajor,
            //   exactMatch: true,
            //   subNavigationItems: alchmeyApis.map(({id}) => ({
            //     label: id,
            //     url: `/api/${id}`,
            //     exactMatch: true,
            //   })),
            // },
          ]
        }
      />
    </Navigation>
  )
}
