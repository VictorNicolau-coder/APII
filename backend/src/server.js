const app = require("./app")
require('dotenv').config()

app.listen(process.env.PORT, ()=> console.log(`Server executando na porta http://localhost:${process.env.PORT}`))