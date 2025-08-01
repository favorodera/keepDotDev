declare module '@supabase/supabase-js' {
  interface UserMetadata {
    name: string
    full_name: string
    avatar_url: string
    user_name: string
    filesPerPage?: number
    foldersPerPage?: number
  }
}

declare module '#app' {
  interface NuxtError {
    data: {
      message: string
      statusMessage: string
    }
  }
}

export {}
