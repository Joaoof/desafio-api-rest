import { randomUUID } from 'node:crypto'
import { knex } from '../src/database'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createMealsBodySchema.parse(request.body)

    // eslint-disable-next-line camelcase
    const password_hash = await bcrypt.hash(password, 10)

    await knex('meals').insert({
      id: randomUUID(),
      name,
      email,
      // eslint-disable-next-line camelcase
      password_hash,
    })

    return reply.status(201).send()
  })
}
