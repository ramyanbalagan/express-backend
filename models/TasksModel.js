const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    user: Number,
    name: String,
    description: String,
    updatedAt: String,
    status: Boolean
})

module.exports = mongoose.model('tasks', taskSchema)