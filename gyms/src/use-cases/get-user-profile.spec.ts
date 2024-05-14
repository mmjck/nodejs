import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let repository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(repository)
  })

  it('should able to get user profile', async () => {
    const createdUser = await repository.create({
      email: 'maria@gmail.som',
      password_hash: await hash('teste123', 6),
      name: 'Maria',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Maria')
  })

  it('should bot be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-not-found',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
