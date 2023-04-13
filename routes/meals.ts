import { knex } from '../src/database'
import crypto from 'node:crypto'
import { FastifyInstance } from 'fastify'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const meals = await knex('meals')
      .insert({
        id: crypto.randomUUID(),
        name: 'Criação de usuario teste',
        email: 'joaodeus400@gmail.com',
        password_hash: 'senha123',
      })
      .returning('*')

    return meals
  })
}
