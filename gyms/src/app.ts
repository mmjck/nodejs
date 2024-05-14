import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyjwt from '@fastify/jwt'
import { usersRoutes } from './http/controllers/users/routes'
import { gymRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyjwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})
app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: here we should log to an external tool like Sentry...
  }
  return reply.status(500).send({ message: 'Internal server error' })
})
