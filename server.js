const app = require('./src/app')
const connect = require('./src/models/connection')
require('dotenv').config()

connect()

app.listen( process.env.PORT, () => {
    console.log(`Server executando na porta http://localhost:${process.env.PORT}`)
})