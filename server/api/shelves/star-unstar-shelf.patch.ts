import z from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/utils/types/database'

const bodySchema = z.object({
  action: z.enum(['star', 'unstar'], {
    errorMap: () => ({ message: 'Action is required' }),
  }),
  shelfId: z.string().nonempty('Shelf ID is required'),
})

export default defineEventHandler(async (event) => {
 
  try {

    const authenticatedUser = await serverSupabaseUser(event)

    if (!authenticatedUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'You must be logged in to access this resource',
      })
    }

    const { action, shelfId } = await readValidatedBody(event, body => bodySchema.parse(body))

    const serverClient = await serverSupabaseClient<Database>(event)

    const { error, data } = await serverClient
      .from('shelves')
      .update({ starred: action === 'star' })
      .match({ id: shelfId, owner_id: authenticatedUser.id })
      .select('name')
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.code,
        message: error.message,
      })
    }

    return {
      statusMessage: 'OPERATION_SUCCESSFUL',
      message: `Shelf "${data.name}" ${action === 'star' ? 'starred' : 'unstarred'} successfully`,
    }
  } catch (error) {
    return catchError(error)
  }

})
