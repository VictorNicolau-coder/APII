const app = require('./src/app')
const connect = require('./src/models/connection')
require('dotenv').config()

connect()


/* app.listen(process.env.PORT, () => {
    console.log(`Server runnin on port http://localhost:${process.env.PORT}`)
}) */
module.exports = app