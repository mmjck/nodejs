import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gyms'

let repository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gym Use Case', () => {
  beforeEach(async () => {
    repository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(repository)
  })

  it('should be able to search for gyms', async () => {
    await repository.create({
      title: 'js-gym',
      description: null,
      phone: null,
      latitude: -3.1334148,
      longitude: -59.9949895,
    })

    await repository.create({
      title: 'js-gym',
      description: null,
      phone: null,
      latitude: -3.1334148,
      longitude: -59.9949895,
    })

    const { gyms } = await sut.execute({ query: 'js', page: 1 })
    expect(gyms).toHaveLength(2)
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create({
        title: `js - gym ${i}`,
        description: null,
        phone: null,
        latitude: -3.1334148,
        longitude: -59.9949895,
      })
    }

    const { gyms } = await sut.execute({
      query: 'js',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'js - gym 21' }),
      expect.objectContaining({ title: 'js - gym 22' }),
    ])
  })
})
