import { z } from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const bodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const authenticatedUser = await serverSupabaseUser(event)
    if (!authenticatedUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      })
    }

    const { data: validatedBody, error: validationError } = await readValidatedBody(event, body => bodySchema.safeParse(body))
    if (validationError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'VALIDATION_ERROR',
        message: `${validationError.errors[0] ? `${validationError.errors[0].path}: ${validationError.errors[0].message}` : 'Invalid body parameters'}`,
      })
    }

    const { name, description } = validatedBody
    const serverClient = await serverSupabaseClient<Database>(event)

    const { error } = await serverClient
      .from('folders')
      .insert({
        name,
        description,
        owner_id: authenticatedUser.id,
        owner_metadata: {
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
      message: 'Folder created successfully',
    }
  } catch (error) {
    return catchError(error)
  }
}) 