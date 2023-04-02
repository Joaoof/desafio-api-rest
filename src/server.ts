import fastify from 'fastify' // importando fastify
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify() // chamar o fastify

app.register(transactionsRoutes)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running')
  }) // porta a ser ouvida
