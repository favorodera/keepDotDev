import { z } from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/utils/types/database'

const bodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).min(1),
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

    const { name, description, tags } = await readValidatedBody(event, body => bodySchema.parse(body))

    const serverClient = await serverSupabaseClient<Database>(event)

    const { error } = await serverClient
      .from('shelves')
      .insert({
        name,
        description,
        tags,
        owner_id: authenticatedUser.id,
        owner_metadata: {
          name: authenticatedUser.user_metadata.name,
          full_name: authenticatedUser.user_metadata.full_name,
          avatar_url: authenticatedUser.user_metadata.avatar_url,
          user_name: authenticatedUser.user_metadata.user_name,
        },
      })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.code,
        message: error.message,
      })
    }

    return {
      statusMessage: 'OPERATION_SUCCESSFUL',
      message: 'Shelf created successfully',
    }
  } catch (error) {
    return catchError(error)
  }
})
