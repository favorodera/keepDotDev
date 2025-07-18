import { streamText, convertToModelMessages } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { serverSupabaseUser } from '#supabase/server'

const textUIPartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  state: z.enum(['streaming', 'done']).optional(),
})

const stepStartUIPartSchema = z.object({
  type: z.literal('step-start'),
})

const uiMessagePartSchema = z.union([
  textUIPartSchema,
  stepStartUIPartSchema,
])

const uiMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['system', 'user', 'assistant']),
  parts: z.array(uiMessagePartSchema),
  metadata: z.any().optional(),
})

const FileSchema = z.object({
  id: z.number(),
  name: z.string(),
  folder_id: z.number(),
  owner_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  content: z.string(),
})

const FolderSchema = z.object({
  owner_id: z.string(),
  owner_metadata: z.object({
    full_name: z.string(),
    avatar_url: z.string(),
    user_name: z.string(),
  }),
  id: z.number(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  starred: z.boolean(),
  files: z.array(FileSchema),
})

const bodySchema = z.object({
  messages: z.array(uiMessageSchema),
  library: z.array(FolderSchema),
})

export default defineLazyEventHandler(() => {

  const { googleGenerativeAiKey } = useRuntimeConfig()

  if (!googleGenerativeAiKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'GENERATIVE_API_KEY_MISSING',
      message: 'Generative api key missing',
    })
  }

  const google = createGoogleGenerativeAI({
    apiKey: googleGenerativeAiKey,
  })
  
  return defineEventHandler(async (event) => {

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

      const { messages, library } = validatedBody

      const system = systemPrompt(library)

      const model = google('gemini-1.5-flash')

      const result = streamText({
        model,
        system,
        messages: convertToModelMessages(messages),
        onError() {
          throw createError({
            statusCode: 500,
            statusMessage: 'GENERATIVE_ERROR',
            message: 'Error generating response',
          })
        },
      })

      return result.toUIMessageStreamResponse()

    } catch (error) {
      return catchError(error)
    }

  })

})
