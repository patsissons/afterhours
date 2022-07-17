import {Card, TextContainer} from '@shopify/polaris'
import {useI18n} from '@shopify/react-i18n'
import {useAuth} from 'hooks/auth'

const scope = 'Landing'

export function Landing() {
  const [i18n] = useI18n()
  const {user, authAction} = useAuth()

  const authTag = user ? 'auth' : 'unauth'

  return (
    <Card
      title={i18n.translate(`title.${authTag}`, {scope})}
      sectioned
      primaryFooterAction={{
        content: i18n.translate(`authAction.${authTag}`, {scope}),
        onAction: authAction,
      }}
    >
      <TextContainer spacing="loose">
        <p>{i18n.translate('welcome', {scope})}</p>
        <p>{i18n.translate(`info.${authTag}`, {scope})}</p>
      </TextContainer>
    </Card>
  )
}
