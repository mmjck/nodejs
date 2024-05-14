import { PrismaCheckInsRepository } from '@/repositories/prisma/prima-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryUseCase() {
  const repository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(repository)
  return useCase
}
