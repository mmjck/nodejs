import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest) {
  const schema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const schemaParams = z.object({
    gymId: z.string().uuid(),
  })

  console.log('gym id', request.params)
  const { latitude, longitude } = schema.parse(request.body)

  const { gymId } = schemaParams.parse(request.params)

  const useCase = makeCheckInUseCase()

  await useCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    gymId,
    userId: request.user.sub,
  })
}
