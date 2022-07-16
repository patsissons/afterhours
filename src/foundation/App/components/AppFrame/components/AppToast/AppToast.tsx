import {Toast} from '@shopify/polaris'
import {useCallback, useContext} from 'react'
import {
  ToastContext,
  ToastDescriptor,
  ToastStateContext,
} from 'hooks/toast/context'

export function AppToasts() {
  const toasts = useContext(ToastStateContext)
  const {hide} = useContext(ToastContext)
  const handleDismiss = useCallback(
    (toast: ToastDescriptor) => {
      hide(toast)
    },
    [hide],
  )

  if (!toasts || toasts.length === 0) {
    return null
  }

  return <>{toasts.map(renderToast)}</>

  function renderToast(toast: ToastDescriptor) {
    return <Toast key={toast.content} {...toast} onDismiss={onDismiss} />

    function onDismiss() {
      toast.onDismiss?.()
      handleDismiss(toast)
    }
  }
}
