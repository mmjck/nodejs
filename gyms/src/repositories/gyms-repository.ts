import { Gym, Prisma } from '@prisma/client'

export interface FindManyNerbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>

  create(data: Prisma.GymCreateInput): Promise<Gym>
  findManyNearby(params: FindManyNerbyParams): Promise<Gym[]>
}
