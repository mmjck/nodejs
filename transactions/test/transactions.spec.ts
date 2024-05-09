import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'

import request from 'supertest'

import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        type: 'credit',
        amount: 5000,
      })
      .expect(201)
  })

  it('should be able to list all transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        type: 'credit',
        amount: 5000,
      })
      .expect(201)

    const cookies = response.get('Set-Cookie') ?? []
    console.log(cookies)

    const transactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(transactions.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get specific transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        type: 'credit',
        amount: 5000,
      })
      .expect(201)

    const cookies = response.get('Set-Cookie') ?? []
    console.log(cookies)

    const transactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const id = transactions.body.transactions[0].id

    const transaction = await request(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(transaction.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New transaction',
      type: 'credit',
      amount: 5000,
    })

    const cookies = response.get('Set-Cookie') ?? []
    console.log(cookies)

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        type: 'debit',
        amount: 2000,
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({ amount: 3000 })
  })
})
