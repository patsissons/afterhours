import {FrameProps} from '@shopify/polaris'

export const source =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

// width: 124
// export const source =
//   'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999'
// export const source =
//   'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999'

export const logo: FrameProps['logo'] = {
  width: 50,
  topBarSource: source,
  contextualSaveBarSource: source,
  url: 'https://afterhours.place',
  accessibilityLabel: 'afterhours',
}
