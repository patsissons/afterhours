import {createHash} from 'crypto'

import {TopBar} from '@shopify/polaris'
import {useCallback, useState} from 'react'
import {useAuth, useAuthOrg} from 'hooks/auth'

export interface Props {
  toggleMobileNavigation(): void
}

export function AppTopBar({toggleMobileNavigation}: Props) {
  const {user} = useAuth()
  const org = useAuthOrg()
  const [userMenuActive, setUserMenuActive] = useState(false)

  const toggleUserMenu = useCallback(() => {
    setUserMenuActive((value) => !value)
  }, [])

  return (
    <TopBar
      showNavigationToggle
      onNavigationToggle={toggleMobileNavigation}
      userMenu={renderUserMenu()}
    />
  )

  function renderUserMenu() {
    const {avatar, name = ''} = userDetails()

    return (
      <TopBar.UserMenu
        actions={[]}
        name={name}
        detail={org}
        initials="T"
        open={userMenuActive}
        onToggle={toggleUserMenu}
        accessibilityLabel="user menu"
        avatar={avatar}
      />
    )

    function userDetails() {
      if (!user) {
        return {}
      }

      const {email, image = undefined, name = undefined} = user

      const avatar = gravatar(email) ?? image

      return {name, avatar}
    }
  }
}

function gravatar(email: string) {
  try {
    const digest = createHash('md5')
      .update(email.trim().toLowerCase())
      .digest('hex')

    return new URL(digest, 'https://www.gravatar.com/avatar/').toString()
  } catch {
    return undefined
  }
}
