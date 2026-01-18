const express = require("express")
const router = require("./router")
const middleware = require("./middlewares/tasksMiddleware")

const app = express()

//app.use(middleware.validateDay)
app.use(express.json())
app.use(router)

module.exports = app