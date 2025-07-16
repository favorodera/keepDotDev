import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

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

    const serverClient = await serverSupabaseClient<Database>(event)

    const { data, error } = await serverClient
      .from('folders')
      .select('*, files(*)')
      .eq('owner_id', authenticatedUser.id)
      .filter('files.owner_id', 'eq', authenticatedUser.id)
      
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.code,
        message: error.message,
      })
    }
  
    return {
      statusMessage: 'OPERATION_SUCCESSFUL',
      message: 'Shelves fetched successfully',
      library: data,
    }

  } catch (error) {
    return catchError(error)
  }

})
