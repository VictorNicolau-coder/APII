const app = require('./app')
const connect = require('./models/connection')
require('dotenv').config()

connect()

app.listen( process.env.PORT, () => {
    console.log(`Server executando na porta http://localhost:${process.env.PORT}`)
})