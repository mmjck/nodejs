import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './erros/user-already-exists-error'
import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users.repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)
    const user = await this.userRepository.findByEmail(email)

    if (user) {
      throw new UserAlreadyExistsError()
    }

    const response = await this.userRepository.create({
      name,
      email,
      password_hash,
    })
    return { user: response }
  }
}
