export type EmptyProps = Record<string, never>
export type PageProps<P = unknown> = P | {error: any}
