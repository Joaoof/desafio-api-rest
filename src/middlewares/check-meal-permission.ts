import { FastifyReply, FastifyRequest } from 'fastify'
import knex from 'knex'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params
  const sessionId = request.cookies.sessionId

  const meal = await knex('meals-register')
    .where({ session_id: sessionId, id })
    .first()

  if (!meal) {
    return reply.status(404).send({ message: 'Meal not found' })
  }

  if (meal.session_id !== sessionId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
