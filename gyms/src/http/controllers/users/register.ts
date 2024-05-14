import { UserAlreadyExistsError } from '@/use-cases/erros/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = schema.parse(request.body)

  try {
    const useCase = makeRegisterUseCase()

    await useCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    // TODO: fixme
    return reply.status(500).send()
  }

  reply.status(201).send()
}
