import fastify from 'fastify' // importando fastify

const app = fastify() // chamar o fastify

app.get('/hello', () => {
  return 'Hello World'
})

app.listen({
  port: 3333,
}).then(() => {
  console.log('Server is running')
}) // porta a ser ouvida 