import { it, beforeAll, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../../app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'João de Deus',
        email: 'joaodeus400@gmail.com',
        password: 'senha123',
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createMealsResponse = await request(app.server).post('/meals').send({
      name: 'João de Deus',
      email: 'joaodeus400@gmail.com',
      password: 'senha123',
    })

    const cookies = createMealsResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meal).toEqual([
      expect.objectContaining({
        name: 'João de Deus',
        email: 'joaodeus400@gmail.com',
        password: 'senha123',
      }),
    ])
  })
})