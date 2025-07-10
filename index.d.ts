declare module '@supabase/supabase-js' {
  interface UserMetadata {
    name: string
    full_name: string
    avatar_url: string
    user_name: string
  }
}

declare global {
  interface Window {
    __copyCode?: (id: string) => void
  }
}

export {}
