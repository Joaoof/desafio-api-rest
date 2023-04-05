import fastify from 'fastify' // importando fastify
import { env } from './env'
import { mealsRoutes } from './routes/meals'

const app = fastify() // chamar o fastify

app.register(mealsRoutes, {
  prefix: 'meals',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running')
  }) // porta a ser ouvida
