import type { Provider } from '@supabase/supabase-js'

const toast = useToast()

export default async function (provider: Provider) {
  try {
    const client = useSupabaseClient()

    const { error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (error) {
      toast.add({
        title: error.message,
        color: 'error',
        icon: 'lucide:alert-circle',
      })
      return
    }
  } catch {
    toast.add({
      title: 'An error occurred',
      color: 'error',
      icon: 'lucide:alert-circle',
    })
    return
  }
}
