import fastify from 'fastify' // importando fastify
import { knex } from './database'

const app = fastify() // chamar o fastify

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*') // buscar todos os dados da tabela

  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running')
  }) // porta a ser ouvida
