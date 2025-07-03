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

export type Tag = string

export type ShelfItem = {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  shelf: Pick<Shelf, 'id' | 'owner_id' | 'owner_metadata' | 'name' | 'description'>
  content: string
  tags: Tag[]
}

export type Shelf = {
  owner_id: string
  owner_metadata: Pick<DatabaseUser, 'metadata'>
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  items: ShelfItem[]
  tags: Tag[]
}
