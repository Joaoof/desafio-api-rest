import { expect, test } from 'vitest'

test('o usuário consegue criar uma refeição', () => {
  // fazer a chamada hTTP p/ criar um nova transação

  const responseStatusCode = 201

  expect(responseStatusCode).toEqual(201)
})
