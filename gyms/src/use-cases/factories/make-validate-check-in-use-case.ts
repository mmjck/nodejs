import { PrismaCheckInsRepository } from '@/repositories/prisma/prima-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const repository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(repository)
  return useCase
}
