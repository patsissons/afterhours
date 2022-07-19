import {Button, Checkbox, Form, FormLayout, TextField} from '@shopify/polaris'
import {
  asChoiceField,
  submitFail,
  submitSuccess,
  useField,
  useForm,
} from '@shopify/react-form'
import {useI18n} from '@shopify/react-i18n'
import {useRegions} from 'hooks/regions'
import {useToast} from 'hooks/toast'
import {RegionModel} from 'data'

export interface Props {
  org: string
  region?: RegionModel
}

export function RegionForm({org, region}: Props) {
  const [i18n] = useI18n()
  const {show} = useToast()
  const {create, update} = useRegions()
  const {fields, submit, dirty, submitting} = useForm({
    fields: {
      name: useField(region?.name ?? ''),
      displayName: useField(region?.details.displayName ?? ''),
      notes: useField(region?.details.notes ?? ''),
      visible: useField(region?.details.visible ?? true),
    },
    async onSubmit({name, displayName, notes, visible}) {
      try {
        const res = await (region?.id ? update : create)({
          ...region,
          org,
          name,
          details: {displayName, notes, visible},
        })

        if ('error' in res) {
          throw res.error
        }

        show({content: `Region ${region?.id ? 'updating' : 'creating'}`})

        return submitSuccess()
      } catch (error: any) {
        show({
          content: `Error ${region?.id ? 'updating' : 'creating'} region: ${
            error.message
          }`,
          error: true,
        })

        return submitFail()
      }
    },
  })

  return (
    <Form onSubmit={submit}>
      <FormLayout>
        <TextField {...fields.name} label="Name" autoComplete="false" />
        <TextField
          {...fields.displayName}
          label="Display name"
          autoComplete="false"
        />
        <TextField {...fields.notes} label="Notes" autoComplete="false" />
        <Checkbox {...asChoiceField(fields.visible)} label="visible" />
        <Button
          submit
          primary
          onClick={submit}
          disabled={!dirty}
          loading={submitting}
        >
          {i18n.translate(region?.id ? 'update' : 'create')}
        </Button>
      </FormLayout>
    </Form>
  )
}
