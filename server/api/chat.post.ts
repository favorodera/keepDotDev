import type { UIMessage } from 'ai'
import { streamText, convertToModelMessages, tool } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { serverSupabaseUser } from '#supabase/server'

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

      const requestCookie = getRequestHeader(event, 'cookie')

      if (!requestCookie) {
        throw createError({
          statusCode: 401,
          statusMessage: 'UNAUTHORIZED',
          message: 'Authentication cookie missing. You must be logged in to access this resource.',
        })
      }

      const { messages }: { messages: UIMessage[] } = await readBody(event)

      const system = systemPrompt()

      const model = google('gemini-2.5-pro')

      const result = streamText({
        model,
        system,
        messages: convertToModelMessages(messages),
        tools: {
          personalKnowledgeBase: tool({
            description: 'Get data or library (folders and files) for personal knowledge base',
            inputSchema: z.object({
              enquiry: z
                .string()
                .describe('Question or request which will be used to identify the folder or file that best suites for response'),
            }),
            execute: async () => {
              const libraryResponse = await $fetch(
                '/api/library',
                {
                  method: 'GET',
                  headers: {
                    cookie: requestCookie,
                  },
                },
              )
              return {
                personalKnowledgeBase: libraryResponse.library,
              }
            },
          }),
        },
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
