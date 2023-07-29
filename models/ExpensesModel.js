const mongoose = require('mongoose')

const expenseSchema = mongoose.Schema({
    name: String,
    description: String,
    category: String,
    dateofexpense: String,
    updatedAt: String,
    createdBy: String,
    amount: Number
})

module.exports = mongoose.model('expenses', expenseSchema)