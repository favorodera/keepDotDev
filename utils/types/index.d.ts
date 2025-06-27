export type AsyncSuccess<T = unknown> = {
  statusMessage: string
  message: string
} & T | null

export type AsyncError = {
  statusCode: number
  statusMessage: string
  message: string
}

export type OAuthProvider = 'github'
