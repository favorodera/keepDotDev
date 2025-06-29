export type AsyncSuccess<T = unknown> = {
  statusMessage: string
  message: string
} & T | null

export type AsyncError = NuxtError<{
  statusCode: number
  statusMessage: string
  message: string
}>

export type DatabaseUser = {
  id: string
  email: string
  metadata: {
    name: string
    full_name: string
    avatar_url: string
    user_name: string
  }
}
