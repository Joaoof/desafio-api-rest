import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
  client: 'sqlite',
  connection: {
    filename: './tmp/app.db', // nome do arq do banco de dados onde ele vai ser salvo
  },
})
