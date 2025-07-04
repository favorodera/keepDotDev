import type { AuthError, Provider } from '@supabase/supabase-js'

export default function () {

  const toast = useToast()
  const client = useSupabaseClient()
  const overlay = useOverlay()

  async function callAction(action: () => Promise<{ error: AuthError | null }>) {
    try {
      const { error } = await action()
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

  async function signInWithOAuth(provider: Provider) {
    await callAction(() =>
      client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `http://localhost:3000/auth/confirm`,
        },
      }),
    )
  }

  async function signOut() {
    await callAction(() => client.auth.signOut())

    toast.add({
      title: 'Signed out successfully',
      color: 'success',
      icon: 'lucide:check-circle',
    })

    overlay.closeAll()
    await navigateTo('/auth')
  }

  return {
    signInWithOAuth,
    signOut,
  }
}

