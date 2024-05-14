import { PrismaCheckInsRepository } from '@/repositories/prisma/prima-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const repository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(repository)
  return useCase
}
