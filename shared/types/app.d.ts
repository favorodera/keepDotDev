export type AsyncSuccess<T = unknown> = {
  statusMessage: string
  message: string
} & T | null

export type AsyncError = NuxtError<{
  statusCode: number
  statusMessage: string
  message: string
}>

export type DynamicFetchError = {
  statusCode: number
  statusMessage: string
  message: string
}

export type Shelf = {
  owner_id: string
  owner_metadata: {
    name: string
    full_name: string
    avatar_url: string
    user_name: string
  }
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  tags: string[]
  starred: boolean
}

export type ShelfItem = {
  id: number
  shelf_id: number
  owner_id: string
  content: string
}
