import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './erros/user-already-exists-error'

let userRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'maria@gmail.som',
      name: 'maria',
      password: 'teste123',
    })

    const isPasswordCorrectlyHashed = await compare(
      'teste123',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'maria@gmail.som'
    await sut.execute({
      email,
      name: 'maria',
      password: 'teste123',
    })

    await expect(() =>
      sut.execute({
        email,
        name: 'maria',
        password: 'teste123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const email = 'maria@gmail.som'
    const { user } = await sut.execute({
      email,
      name: 'maria',
      password: 'teste123',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
