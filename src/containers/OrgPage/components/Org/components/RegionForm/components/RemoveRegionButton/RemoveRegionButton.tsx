import {Button} from '@shopify/polaris'
import {submitFail, submitSuccess, useForm} from '@shopify/react-form'
import {useI18n} from '@shopify/react-i18n'
import {RegionModel} from 'src/data'
import {useRegions} from 'src/hooks/regions'
import {useToast} from 'src/hooks/toast'

export interface Props {
  region: RegionModel
}

export function RemoveRegionButton({region}: Props) {
  const [i18n] = useI18n()
  const {remove} = useRegions()
  const {show} = useToast()

  const {submit, submitting} = useForm({
    fields: {},
    async onSubmit() {
      try {
        const res = await remove(region)

        if ('error' in res) {
          throw res.error
        }

        show({content: `Region ${region.details.displayName} removed`})

        return submitSuccess()
      } catch (error: any) {
        show({
          content: `Error removing region ${region.details.displayName}: ${error.message}`,
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
