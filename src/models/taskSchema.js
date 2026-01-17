const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    status: {type: String, default: 'pendente'},
    created_at: {type: Date, default: Date.now},
    imageUrl: {type: String, required: true}
})

module.exports = mongoose.model('Tasks', taskSchema)