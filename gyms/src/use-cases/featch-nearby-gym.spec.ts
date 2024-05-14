import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './featch-nearby-gym'

let repository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Featch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    repository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(repository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await repository.create({
      title: 'Near - gym',
      description: null,
      phone: null,
      latitude: -3.1323605,
      longitude: -59.9961638,
    })

    await repository.create({
      title: 'Far - gym',
      description: null,
      phone: null,
      latitude: -2.9787602,
      longitude: -59.9944868,
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.1323605,
      userLongitude: -59.9961638,
    })
    expect(gyms).toHaveLength(1)
  })
})
