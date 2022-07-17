import {useEffect, useState} from 'react'
import {hostParts} from 'utils/url'

export function useHost() {
  const [host, setHost] = useState<string>()
  const [protocol, setProtocol] = useState<string>()

  useEffect(() => {
    const {host, protocol} = window.location

    setHost(host)
    setProtocol(protocol)
  }, [])

  return {
    protocol,
    host,
    ...(host && hostParts(host)),
  }
}
