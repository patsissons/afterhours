import {useEffect, useState} from 'react'
import {Region} from 'data/frozen'

export interface Props {
  org: string
  regions: Region[]
}

export function Org({regions}: Props) {
  const [baseUri, setBaseUri] = useState<string>()
  useEffect(() => {
    const {host, hash, search} = window.location
    const parts = [host]

    if (search) {
      parts.push('?', search)
    }

    if (hash) {
      parts.push('#', hash)
    }

    setBaseUri(parts.join(''))
  }, [])

  if (!baseUri) {
    return null
  }

  return (
    <div>
      {regions.map(({name}) => {
        return (
          <a key={name} href={`/${name}`}>
            {name}
          </a>
        )
      })}
    </div>
  )
}
