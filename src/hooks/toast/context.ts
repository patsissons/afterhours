import {Action} from '@shopify/polaris'
import {createContext} from 'react'
import {noop} from 'utils/misc'

export interface ToastDescriptor {
  content: string
  error?: boolean
  dismissible?: boolean
  duration?: number
  onDismiss?(): void
  action?: Action
}

export interface Toast {
  show(toastToShow: ToastDescriptor): void
  hide(
    removeSelector?: ToastDescriptor | ((item: ToastDescriptor) => boolean),
  ): void
}

export const ToastContext = createContext<Toast>({
  show: noop,
  hide: noop,
})

export const ToastStateContext = createContext<ToastDescriptor[] | undefined>(
  undefined,
)
