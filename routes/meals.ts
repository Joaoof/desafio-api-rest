/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../src/database'
import { checkSessionIdExists } from '../src/middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meal = await knex('meals').where('session_id', sessionId).select('')
      // return { total: 3, meals }

      const tables = await knex('meals-register').where('session_id', sessionId).select('')


      return { meal, tables }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const meal = await knex('meals-register')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { meal }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('meals')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  app.post(
    '/',
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })

      // app.addHook('preHandler', checkSessionIdExists)
      // })

      const { name, email, password } = createMealsBodySchema.parse(
        request.body,
      )

      // eslint-disable-next-line camelcase

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
        password,
        session_id: sessionId,
      })

      return reply.status(201).send()
    })

    app.post('/register-meals', 
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        time: z.string(),
        isDiet: z.boolean(),
      })

      const { name, description, date, time, isDiet } = createMealBodySchema.parse(
        request.body,
      )

      let sessionId = request.cookies.sessionId

      console.log('sessionId', sessionId)



      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
      }
      
      await knex('meals-register').insert({
        id: randomUUID(),
        name,
        description,
        date,
        time,
        isDiet,
        session_id: sessionId,
      });
  
      return reply.status(201).send();
    },
    )
    app.put(
      '/:id',
      {
        preHandler: [checkSessionIdExists],
      },
      async (request, reply) => {
        const updateMealBodySchema = z.object({
          name: z.string(),
          description: z.string(),
          date: z.string(),
          time: z.string(),
          isDiet: z.boolean(),
        })
    
        const { name, description, date, time, isDiet } = updateMealBodySchema.parse(
          request.body,
        )
    
        const getMealsParamsSchema = z.object({
          id: z.string().uuid(),
        })
    
        const { id } = getMealsParamsSchema.parse(request.params)
    
        const { sessionId } = request.cookies
    
        const meal = await knex('meals-register')
          .where({
            session_id: sessionId,
            id,
          })
          .first()
    
        if (!meal) {
          return reply.status(404).send({ message: 'Meal not found' })
        }
    
        await knex('meals-register')
          .where({
            session_id: sessionId,
            id,
          })
          .update({
            name,
            description,
            date,
            time,
            isDiet
          })
    
        return reply.status(200).send()
      },
    )
      app.delete(
        '/:id',
        {
          preHandler: [checkSessionIdExists],
        },
        async (request, reply) => {
          const deleteMealsParamsSchema = z.object({
            id: z.string().uuid(),
          })
      
          const { id } = deleteMealsParamsSchema.parse(request.params)
      
          const { sessionId } = request.cookies

            const meals = await knex('meals-register')
            .where({
              session_id: sessionId,
              id,
            })
            .first()

          if (!meals) {
            return reply.status(404).send({ message: 'Meal not found' })
          }
            await knex('meals-register')
            .where({
              session_id: sessionId,
              id,
            })
            .delete()
      
          return reply.status(204).send()
        },
      )
        app.get(
          '/metrics',
          {
            preHandler: [checkSessionIdExists],
          },
          async (request) => {
            const { sessionId } = request.cookies
        
            
    const totalMeals = await knex('meals-register')
    .where({
      session_id: sessionId,
    })
    .count('id', { as: 'count' })
    .first()

  const totalDietMeals = await knex('meals-register')
    .where({
      session_id: sessionId,
      isDiet: true,
    })
    .count('id', { as: 'count' })
    .first()

  const totalNonDietMeals = await knex('meals-register')
    .where({
      session_id: sessionId,
      isDiet: false,
    })
    .count('id', { as: 'count' })
    .first()
          //   const bestSequence = await knex.raw(`
          //   SELECT 
          //     date, 
          //     COUNT(*) AS count 
          //   FROM meals-register
          //   WHERE 
          //     session_id = ? 
          //     AND isDiet = true
          //   GROUP BY date
          //   ORDER BY count DESC
          //   LIMIT 1
          // `, [sessionId])
          return {
            totalMeals: totalMeals?.count || 0,
            totalDietMeals: totalDietMeals?.count || 0,
            totalNonDietMeals: totalNonDietMeals?.count || 0,
          }},             
        )}