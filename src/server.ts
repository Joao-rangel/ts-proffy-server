import express from 'express'
import routes from './routes'

const app = express() // declarou variavel app (aplicação) e chamou a função express

app.use(express.json()) // fala ao ts para usar json
app.use(routes)

app.listen(3333) // ouve (vigia, espera) requisições http