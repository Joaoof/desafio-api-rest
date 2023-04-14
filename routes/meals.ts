import { randomUUID } from 'node:crypto'
import { knex } from '../src/database'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex('meals').select()

    return { total: 3, meals }
  })

  app.get('/:id', async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    return { meal }
  })

  app.get('/summary', async () => {
    const summary = await knex('meals').sum('amount', { as: 'amount' }).first()

    return { summary }
  })

  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      // amount: z.string(),
      // type: z.enum(['dieta', 'fora da dieta']),
    })

    const { name, email, password } = createMealsBodySchema.parse(request.body)

    // eslint-disable-next-line camelcase
    const password_hash = await bcrypt.hash(password, 10)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      email,
      // eslint-disable-next-line camelcase
      password_hash,
      // amount: (type === 'dieta' ? amount : Number(amount) * -1).toString(),
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
