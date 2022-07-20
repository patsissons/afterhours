import {Button} from '@shopify/polaris'
import {submitFail, submitSuccess, useForm} from '@shopify/react-form'
import {useI18n} from '@shopify/react-i18n'
import {RegionalEventModel} from 'src/data'
import {useToast} from 'src/hooks/toast'

export interface Props {
  event: RegionalEventModel
}

export function RemoveRegionalEventButton({event}: Props) {
  const [i18n] = useI18n()
  const {show} = useToast()

  const {submit, submitting} = useForm({
    fields: {},
    async onSubmit() {
      try {
        // const res = await remove(event)

        // if ('error' in res) {
        //   throw res.error
        // }

        // show({content: `Event ${event.details.location.name} removed`})
        show({content: JSON.stringify(event)})

        return submitSuccess()
      } catch (error: any) {
        show({
          content: `Error removing event ${event.details.location.name}: ${error.message}`,
          error: true,
        })

        return submitFail()
      }
    },
  })

  return (
    <Button destructive onClick={submit} loading={submitting}>
      {i18n.translate('content')}
    </Button>
  )
}
