import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { register } from './register'
import { profile } from './profile'
import { refresh } from './refresh-token'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  app.patch('/token/refresh', refresh)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
