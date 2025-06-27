import type { Provider } from '@supabase/supabase-js'

export default async function (provider: Provider) {
  const toast = useToast()

  try {

    const client = useSupabaseClient()

    const { error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `https://keepdotdev.vercel.app/auth/confirm`,
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
