import { z } from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/utils/types/database'

const bodySchema = z.object({
  shelfId: z.number().int().min(1, 'Shelf ID must be a positive integer starting from 1'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  tags: z.array(z.string()).min(1, 'Tags are required').optional(),
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

    const { data: validatedData, error: validationError } = await readValidatedBody(event, body => bodySchema.safeParse(body))

    if (validationError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'VALIDATION_ERROR',
        message: validationError.errors[0].message,
      })
    }

    const { shelfId, name, description, tags } = validatedData

    const serverClient = await serverSupabaseClient<Database>(event)

    function whatToUpdate() {
      const update: Record<string, unknown> = {}
      if (name) update.name = name
      if (description) update.description = description
      if (tags) update.tags = tags
      return update
    }

    const { error, data } = await serverClient
      .from('shelves')
      .update(whatToUpdate())
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
      message: `Shelf "${data.name}" updated successfully`,
    }
  } catch (error) {
    return catchError(error)
  }
})



