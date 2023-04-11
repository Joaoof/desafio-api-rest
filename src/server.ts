import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'
import { env } from './env'

const app = fastify()

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

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server have ok!')
  })
