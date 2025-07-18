import type { AuthError, Provider } from '@supabase/supabase-js'

export default function () {
  const toast = useToast()
  const client = useSupabaseClient()
  const overlay = useOverlay()

  async function callAuthUtil(util: () => Promise<{ error: AuthError | null }>) {

    try {
      const { error } = await util()
      if (error) {
        toast.add({
          title: error.message,
          color: 'error',
          icon: 'lucide:circle-x',
        })
        return
      }
    } catch {
      toast.add({
        title: 'An error occurred',
        color: 'error',
        icon: 'lucide:circle-x',
      })
      return
    }

  }

  async function signInWithOAuth(provider: Provider) {
    await callAuthUtil(() =>
      client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: import.meta.env.DEV ? `http://localhost:3000/auth/confirm` : `https://keepdotdev.vercel.app/auth/confirm`,
        },
      }),
    )
  }

  async function signOut() {
    await callAuthUtil(() => client.auth.signOut())

    toast.add({
      title: 'Signed out successfully',
      color: 'success',
      icon: 'lucide:circle-check',
    })

    overlay.closeAll()
    await nextTick(async () => await navigateTo('/auth'))
  }

  async function updateUser(value: Record<string, unknown>) {
    await callAuthUtil(() => client.auth.updateUser(({
      data: value,
    })))
  }

  return {
    signInWithOAuth,
    signOut,
    updateUser,
  }
}
