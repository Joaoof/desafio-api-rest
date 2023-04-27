import { FastifyReply, FastifyRequest } from 'fastify'
import knex from 'knex'

export async function checkMealPermission(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId
  const { id } = request.params as { id: string }

  const meal = await knex('meals-register')
    .where({ session_id: sessionId, id })
    .first()

  if (!meal) {
    return reply.status(404).send({ message: 'Meal not found' })
  }

  if (meal.session_id !== sessionId) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  // If the user's session matches the session stored in the meals table,
  // allow the user to view, edit, or delete the meal
  // Your code to handle the request goes here...
}
