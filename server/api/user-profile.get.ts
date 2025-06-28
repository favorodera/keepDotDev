import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

  try {
    const authenticatedUser = event.context.authenticatedUser

    // if (!authenticatedUser) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: 'Unauthorized',
    //     message: 'You must be logged in to access this resource',
    //   })
    // }

    const serverClient = await serverSupabaseClient(event)

    const { data, error } = await serverClient
      .from('users')
      .select('email,metadata')
      .match({ id: authenticatedUser.id, email: authenticatedUser.email })
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
      message: 'User profile fetched successfully',
      user: data,
    }
  } catch (error) {
    return catchError(error)
  }

})
