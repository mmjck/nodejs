import { FastifyInstance } from 'fastify'
import { register } from './controllers/users/register'
import { authenticate } from './controllers/users/authenticate'
import { profile } from './controllers/users/profile'
import { verifyJwt } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
