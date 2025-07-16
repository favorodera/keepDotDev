import { z } from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const bodySchema = z.object({
  folderId: z.number().int().min(1, 'Folder ID must be a positive integer starting from 1'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
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

    const { folderId, name, description } = validatedBody
    const serverClient = await serverSupabaseClient<Database>(event)

    function whatToUpdate() {
      const update: Record<string, unknown> = {}
      if (name) update.name = name
      if (description) update.description = description
      return update
    }
    const { error, data } = await serverClient
      .from('folders')
      .update(whatToUpdate())
      .match({ id: folderId, owner_id: authenticatedUser.id })
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
      message: `Folder "${data.name}" updated successfully`,
    }
  } catch (error) {
    return catchError(error)
  }
})
