import express from 'express'
import cors from 'cors' /* cors permite que frontend na porta 3000 se comunique com o backend na porta 3333 */
import routes from './routes'

const app = express() // declarou variavel app (aplicação) e chamou a função express

app.use(cors)
app.use(express.json()) // fala ao ts para usar json
app.use(routes)

app.listen(3333) // ouve (vigia, espera) requisições http