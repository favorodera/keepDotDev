import { z } from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const bodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  folderId: z.number().int().min(1, 'Folder ID must be a positive integer starting from 1'),
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
        message: `${validationError.issues[0] ? `${validationError.issues[0].path}: ${validationError.issues[0].message}` : 'Invalid body parameters'}`,
      })
    }

    const { name, folderId } = validatedBody
    const serverClient = await serverSupabaseClient<Database>(event)

    const { error } = await serverClient
      .from('files')
      .insert({
        name,
        folder_id: folderId,
        owner_id: authenticatedUser.id,
        content: `# ${name}`,
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
      message: 'File created successfully',
    }
  } catch (error) {
    return catchError(error)
  }
})
