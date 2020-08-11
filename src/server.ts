import express from 'express'

const app = express() // declarou variavel app (aplicação) e chamou a função express

app.use(express.json()) // fala ao ts para usar json

app.get('/', (request, response) => {

  return response.json({users: 'sou um usuário'})
})

app.listen(3333) // ouve (vigia, espera) requisições http