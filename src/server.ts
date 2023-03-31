import fastify from 'fastify' // importando fastify
import { knex } from './database'

const app = fastify() // chamar o fastify

app.get('/hello', async () => {
  const transactions = await knex('transactions')
    .where('amount', 1000)
    .select('*')

  return transactions
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running')
  }) // porta a ser ouvida
