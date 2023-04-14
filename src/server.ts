import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { mealsRoutes } from '../routes/meals'
import { env } from './env'

const app = fastify()

app.register(cookie)
app.register(mealsRoutes, {
  prefix: 'meals',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server have ok!')
  })
