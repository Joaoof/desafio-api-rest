import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../../app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
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

  it('should be able to get specific meals', async () => {
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

    const mealId = listMealsResponse.body.meal[0].id

    const getMealsResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealsResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'João de Deus',
        email: 'joaodeus400@gmail.com',
        password: 'senha123',
      }),
    )
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

  it('should be able to create a new user', async () => {
    const createMealsResponse = await request(app.server)
      .post('/meals/register-meals')
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão, carne e salada',
        date: '2023-04-24',
        time: '12:30',
        isDiet: true,
      })

    const cookies = createMealsResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.tables).toEqual([
      expect.objectContaining({
        name: 'Almoço',
        description: 'Arroz, feijão, carne e salada',
        date: '2023-04-24',
        time: '12:30',
        isDiet: true,
      }),
    ])
  })
})
