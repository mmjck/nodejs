import { beforeEach, describe, expect, it } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'

let repository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(repository)
  })

  it('should able to authenticate', async () => {
    await repository.create({
      email: 'maria@gmail.som',
      password_hash: await hash('teste123', 6),
      name: 'Maria',
    })

    const { user } = await sut.execute({
      email: 'maria@gmail.som',
      password: 'teste123',
    })

    const isPasswordCorrectlyHashed = await compare(
      'teste123',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should bot be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'maria@gmail.som',
        password: 'teste123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should bot be able to authenticate with wrong password', async () => {
    await repository.create({
      email: 'maria@gmail.som',
      password_hash: await hash('teste123', 6),
      name: 'Maria',
    })

    await expect(() =>
      sut.execute({
        email: 'maria@gmail.som',
        password: 'teste122',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
