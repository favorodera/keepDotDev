import { z } from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const bodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  shelfId: z.string().transform((value) => {
    const number = Number.parseInt(value, 10)
    if (Number.isNaN(number) || number <= 0) {
      throw new Error('Shelf ID must be a positive integer starting from 1')
    }
    return number
  }),
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

    const { name, shelfId } = validatedBody

    const serverClient = await serverSupabaseClient<Database>(event)

    const { error } = await serverClient
      .from('shelves_items')
      .insert({
        name,
        shelf_id: shelfId,
        owner_id: authenticatedUser.id,
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
      message: 'Shelf item created successfully',
    }
  } catch (error) {
    return catchError(error)
  }
})
