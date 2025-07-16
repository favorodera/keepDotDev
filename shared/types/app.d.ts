export type AsyncSuccess<T = unknown> = {
  statusMessage: string
  message: string
} & T

export type AsyncError = NuxtError<{
  statusCode: number
  statusMessage: string
  message: string
}>

export type DollarFetchError = {
  statusCode: number
  statusMessage: string
  message: string
}

export type File = {
  id: number
  name: string
  folder_id: number
  owner_id: string
  created_at: string
  updated_at: string
  content: string
}

export type Folder = {
  owner_id: string
  owner_metadata: {
    full_name: string
    avatar_url: string
    user_name: string
  }
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  starred: boolean
  files: File[]
}

export type Library = Folder[]
