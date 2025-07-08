import z from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const bodySchema = z.object({
  action: z.enum(['star', 'unstar'], {
    errorMap: () => ({ message: 'Action is required' }),
  }),
  shelfId: z.number().int().min(1, 'Shelf ID must be a positive integer starting from 1'),
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

    const { action, shelfId } = validatedBody

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
