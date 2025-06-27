import { H3Error } from 'h3'
import { z } from 'zod'

export default function (error: unknown) {
  if (error instanceof z.ZodError) {
    throw createError({
      statusCode: 400,
      statusMessage: 'VALIDATION_ERROR',
      message: error.errors[0].message,
    })
  }
  
  if (error instanceof H3Error) {
    throw createError({
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      message: error.message,
    })
  }
      
  if (error instanceof Error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    })
  }
      
  throw createError({
    statusCode: 500,
    statusMessage: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  })
}
