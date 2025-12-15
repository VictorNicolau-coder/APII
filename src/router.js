const express = require('express')
const tasksController = require('./controllers/tasksController')
const tasksMiddleware = require('./middlewares/tasksMiddleware')

const router = express.Router()

// Rota de login
router.post(
    '/logar', 
    tasksController.searchLogin
)

router.get(
    '/tasks', 
    tasksMiddleware.authenticate,
    tasksController.getAll
)

router.get(
    '/task/:id',
    tasksMiddleware.authenticate,
    tasksController.getById
)

router.post(
    '/tasks',
    tasksMiddleware.authenticate,
    tasksMiddleware.validateTitle, 
    tasksController.createTask
)

router.delete(
    '/tasks/:id', 
    tasksMiddleware.authenticate,
    tasksController.deleteTask
)

router.put(
    '/tasks/:id',
    tasksMiddleware.authenticate, 
    tasksMiddleware.validateTitle, 
    tasksMiddleware.validateStatus,
    tasksController.updateTask
)

router.get(
    '/pdf', 
    tasksMiddleware.authenticate, 
    tasksController.gerarPdf
)

module.exports = router
