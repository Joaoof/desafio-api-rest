import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals-register', (table) => {
    table.uuid('id').primary()
    table.uuid('userId').defaultTo(null) // adicionando coluna userId
    table.text('name').notNullable()
    table.text('description').notNullable() // adicionando coluna description
    table.text('date').notNullable() // adicionando coluna date
    table.text('time').notNullable() // adicionando coluna time
    table.boolean('isDiet').notNullable() // adicionando coluna isDiet
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals-register')
}
