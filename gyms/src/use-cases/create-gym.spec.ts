import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let repository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(repository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'js-gym',
      description: null,
      phone: null,
      latitude: -3.1334148,
      longitude: -59.9949895,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
