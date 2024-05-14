import { SearchGymUseCase } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeSearchGymsUseCase() {
  const repository = new PrismaGymsRepository()
  const useCase = new SearchGymUseCase(repository)
  return useCase
}
