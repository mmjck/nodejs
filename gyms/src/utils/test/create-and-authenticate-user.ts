import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('teste123', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const response = await request(app.server).post('/session ').send({
    email: 'johndoe@example.com',
    password: 'teste123',
  })

  const { token } = response.body
  return { token }
}
