import {
  Button,
  ButtonGroup,
  Checkbox,
  Form,
  FormLayout,
  TextField,
} from '@shopify/polaris'
import {
  asChoiceField,
  submitFail,
  submitSuccess,
  useField,
  useForm,
} from '@shopify/react-form'
import {useI18n} from '@shopify/react-i18n'
import {useToast} from 'hooks/toast'
import {RegionalEventModel} from 'data'

import {RemoveRegionalEventButton} from './components'

export interface Props {
  event?: RegionalEventModel
}

export function RegionEventForm({event}: Props) {
  const [i18n] = useI18n()
  const {show} = useToast()
  const {fields, submit, dirty, submitting} = useForm({
    fields: {
      name: useField(event?.name ?? ''),
      date: useField(event?.date ?? ''),
      locationName: useField(event?.details.location.name ?? ''),
      coords: useField(event?.details.location.coords ?? ''),
      url: useField(event?.details.location.url ?? ''),
      notes: useField(event?.details.notes ?? ''),
      visible: useField(event?.details.visible ?? true),
    },
    async onSubmit({name, date, locationName, coords, url, notes, visible}) {
      try {
        // const res = await (event?.id ? update : create)({
        //   ...region,
        //   org,
        //   name,
        //   details: {displayName, notes, visible},
        // })

        // if ('error' in res) {
        //   throw res.error
        // }

        // show({content: `Region ${region?.id ? 'updating' : 'creating'}`})
        show({
          content: JSON.stringify({
            name,
            date,
            locationName,
            coords,
            url,
            notes,
            visible,
          }),
        })

        return submitSuccess()
      } catch (error: any) {
        show({
          content: `Error ${event?.id ? 'updating' : 'creating'} region: ${
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
          {...fields.date}
          label="Date"
          autoComplete="false"
          type="datetime-local"
        />
        <TextField
          {...fields.name}
          label="Location name"
          autoComplete="false"
        />
        <TextField
          {...fields.coords}
          label="GPS location"
          autoComplete="false"
        />
        <TextField {...fields.url} label="URL" autoComplete="false" />
        <TextField {...fields.notes} label="Notes" autoComplete="false" />
        <Checkbox {...asChoiceField(fields.visible)} label="visible" />
        <ButtonGroup>
          <Button
            submit
            primary
            onClick={submit}
            disabled={!dirty}
            loading={submitting}
          >
            {i18n.translate(event?.id ? 'update' : 'create')}
          </Button>
          {event && <RemoveRegionalEventButton event={event} />}
        </ButtonGroup>
      </FormLayout>
    </Form>
  )
}
