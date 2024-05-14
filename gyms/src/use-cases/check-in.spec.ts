import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-ins-error'
import { MaxDistanceError } from './erros/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(gymsRepository, checkInsRepository)

    vi.useFakeTimers()

    await gymsRepository.create({
      id: 'gym-01',
      title: 'js-gym',
      description: '',
      phone: '',
      latitude: -3.1334148,
      longitude: -59.9949895,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.1323605,
      userLongitude: -59.9961638,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 1, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.1323605,
      userLongitude: -59.9961638,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -3.1323605,
        userLongitude: -59.9961638,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should  be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.1323605,
      userLongitude: -59.9961638,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.1323605,
      userLongitude: -59.9961638,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'js-gym',
      description: '',
      phone: '',
      latitude: new Decimal(-3.129435),
      longitude: new Decimal(-59.9979775),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -3.1334148,
        userLongitude: -59.9949895,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
