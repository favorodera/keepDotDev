import { z } from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const querySchema = z.object({
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

    const { data: validatedQuery, error: validationError } = await getValidatedQuery(event, query => querySchema.safeParse(query))

    if (validationError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'VALIDATION_ERROR',
        message: validationError.errors[0].message,
      })
    }

    const { shelfId } = validatedQuery

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
