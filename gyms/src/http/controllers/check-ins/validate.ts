import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const schemaParams = z.object({
    id: z.string().uuid(),
  })

  const { id } = schemaParams.parse(request.params)
  const useCase = makeValidateCheckInUseCase()

  await useCase.execute({
    checkInId: id,
  })

  return reply.status(204).send()
}
