import type { User } from '@supabase/auth-js/src/lib/types.ts'

declare module 'h3' {
  interface H3EventContext {
    authenticatedUser: User
  }
}
