import { test, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../../app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('o usuário consegue criar uma refeição', async () => {
  await request(app.server)
    .post('/')
    .send({
      name: 'João',
      email: 'aleatorio400@gmail.com',
      password: 'senha123',
      amount: 'Olá',
    })
    .expect(201)
})
