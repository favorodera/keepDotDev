import z from 'zod'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const bodySchema = z.object({
  folderId: z.number().int().min(1, 'Folder ID must be a positive integer starting from 1'),
  fileId: z.number().int().min(1, 'File ID must be a positive integer starting from 1'),
  content: z.string(),
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

    const { content, folderId, fileId } = validatedBody
    const serverClient = await serverSupabaseClient<Database>(event)

    const { error, data } = await serverClient
      .from('files')
      .update({ content })
      .match({ id: fileId, owner_id: authenticatedUser.id, folder_id: folderId })
      .select('name, content')
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
      message: `"${data.name}" content updated successfully`,
      content: data.content,
    }
  } catch (error) {
    return catchError(error)
  }
})
