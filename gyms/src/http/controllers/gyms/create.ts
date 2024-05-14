import { makeCreateGymsUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest) {
  const schema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } = schema.parse(
    request.body,
  )

  const useCase = makeCreateGymsUseCase()

  await useCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude: longitude,
  })
}
