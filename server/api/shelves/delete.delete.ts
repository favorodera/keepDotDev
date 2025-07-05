import { z } from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/utils/types/database'

const querySchema = z.object({
  shelfId: z.string(),
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

    const { shelfId } = await getValidatedQuery(event, query => querySchema.parse(query))

    const serverClient = await serverSupabaseClient<Database>(event)

    const { error, data } = await serverClient
      .from('shelves')
      .delete()
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
      message: `Shelf "${data.name}" deleted successfully`,
    }
  } catch (error) {
    return catchError(error)
  }
})
