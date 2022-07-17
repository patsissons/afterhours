import {
  Banner,
  Button,
  Card,
  Checkbox,
  Collapsible,
  DisableableAction,
  Form,
  FormLayout,
  LoadableAction,
  TextField,
} from '@shopify/polaris'
import {
  useField,
  asChoiceField,
  useForm,
  submitSuccess,
  submitFail,
} from '@shopify/react-form'
import {useI18n} from '@shopify/react-i18n'
import {useCallback, useState} from 'react'
import {useToast} from 'hooks/toast'
import {useRegions} from 'hooks/regions'
import {JsonData} from 'src/components/JsonData'

export interface Props {
  org: string
}

export function Org({org}: Props) {
  const [i18n] = useI18n()
  const {regions, create} = useRegions()
  const [formVisible, setFormVisible] = useState(false)
  const {show} = useToast()
  const {fields, submit, dirty, submitting} = useForm({
    fields: {
      name: useField(''),
      displayName: useField(''),
      notes: useField(''),
      visible: useField(true),
    },
    async onSubmit({name, displayName, notes, visible}) {
      try {
        const res = await create({
          org,
          name,
          details: {displayName, notes, visible},
        })

        if ('error' in res) {
          throw res.error
        }

        show({content: 'Region created'})

        return submitSuccess()
      } catch (error: any) {
        show({content: `Error adding region: ${error.message}`, error: true})

        return submitFail()
      }
    },
  })

  const toggleForm = useCallback(() => {
    setFormVisible((value) => !value)
  }, [])

  return (
    <Card
      title={i18n.translate('title', {count: regions.length})}
      actions={[
        {
          content: formVisible ? 'Hide region form' : 'Show create region form',
          onAction: toggleForm,
        },
      ]}
    >
      {renderForm()}
      {renderRegions()}
    </Card>
  )

  function renderForm() {
    if (!formVisible) {
      return null
    }

    return (
      <Collapsible id="region-form" open={formVisible}>
        <Card.Section title={i18n.translate('form.title')}>
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
                {i18n.translate('form.submit')}
              </Button>
            </FormLayout>
          </Form>
        </Card.Section>
      </Collapsible>
    )
  }

  function renderRegions() {
    if (regions.length === 0) {
      return (
        <Card.Section>
          <Banner title="No regions yet" status="info" action={bannerAction()}>
            <p>{i18n.translate('banner.content', {org})}</p>
          </Banner>
        </Card.Section>
      )
    }

    return regions.map((region) => {
      const {
        details: {displayName},
        id,
        deleted,
      } = region

      return (
        <Card.Section key={id} title={displayName} subdued={deleted}>
          <JsonData data={region} />
        </Card.Section>
      )
    })

    function bannerAction(): (DisableableAction & LoadableAction) | undefined {
      if (formVisible) {
        return undefined
      }

      return {
        content: 'Add new region',
        onAction: toggleForm,
      }
    }
  }

  // const [baseUri, setBaseUri] = useState<string>()
  // useEffect(() => {
  //   const {host, hash, search} = window.location
  //   const parts = [host]

  //   if (search) {
  //     parts.push('?', search)
  //   }

  //   if (hash) {
  //     parts.push('#', hash)
  //   }

  //   setBaseUri(parts.join(''))
  // }, [])

  // if (!baseUri) {
  //   return null
  // }

  // return (
  //   <div>
  //     {regions.map(({name}) => {
  //       return (
  //         <a key={name} href={`/${name}`}>
  //           {name}
  //         </a>
  //       )
  //     })}
  //   </div>
  // )
}
