import fastify from 'fastify' // importando fastify
import { knex } from './database'
import { env } from './env'

const app = fastify() // chamar o fastify

app.get('/hello', async () => {
  const transactions = await knex('transactions')
    .where('amount', 1000)
    .select('*')

  return transactions
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running')
  }) // porta a ser ouvida
