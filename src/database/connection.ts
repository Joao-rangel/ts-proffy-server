import knex from 'knex'
import path from 'path' // permite passar caminhos sem '/' ou '\' (ver path.resolve)

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite')
  },
  useNullAsDefault: true
})

export default db