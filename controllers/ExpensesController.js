const mongoose = require('mongoose')
const Expense = require('../models/ExpensesModel')

exports.post_expense = async (req, res) => {
    try {
        const newExpense = new Expense({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            dateofexpense: req.body.dateofexpense,
            updatedAt: new Date().toLocaleDateString('en-GB'),
            createdBy: req.body.createdBy,
            amount: req.body.amount
        })

        await newExpense.save()
        res.status(200).json({
            status: 'success',
            results: newExpense
        })

    } catch (error) {
        return res.status(400).json({
            status: 'failed',
            error: error.message
        })
    }
}

exports.get_single_expense = async (req, res) => {
    try {
        const { _id } = req.params;
        let validId = mongoose.isObjectIdOrHexString(_id);
        if(!validId){
            return res.status(400).json({
                status:'failed',
                errors:'Invalid ID'
            })
        }
        const expenses = await Expense.findById(_id);
        if(!expenses){
            return res.status(404).json({
                status: 'success',
                error: 'No data found'
            })
        }

        res.status(200).json({
            status: 'success',
            results: expenses
        })
    } catch (error) {
        return res.status(400).json({
            status: 'failed',
            errors: error.message
        })
    }
}

exports.get_expense = async (req, res) => {
    try {
        const expenses = await Expense.find();
        if(!expenses){
            return res.status(404).json({
                status: 'failed',
                errors: 'No data found'
            })
        }

        res.status(200).json({
            status: 'success',
            results: expenses
        })
    } catch (error) {
        return res.status(400).json({
            status: 'failed',
            errors: error.message
        })
    }
}

exports.put_expense = async (req, res) => {
    try {
        const { _id } = req.params;
        let validId = mongoose.isObjectIdOrHexString(_id);
        if(!validId){
            return res.status(400).json({
                status:'failed',
                errors:'Invalid ID'
            })
        }
        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            dateofexpense: req.body.dateofexpense,
            updatedAt: req.body.updatedAt,
            amount: req.body.amount
        }
        await Expense.findByIdAndUpdate(_id, updatedData)
        res.status(200).json({
            status: 'success',
            results: 'Updated Expense'
        })

    } catch (error) {
        return res.status(404).json({
            status: 'failed',
            errors: error.message
        })
    }
}

exports.delete_expense = async (req, res) => {
    try {
        const { _id } = req.params;
        let validId = mongoose.isObjectIdOrHexString(_id);
        if(!validId){
            return res.status(400).json({
                status: 'failed',
                errors: 'Invalid ID'
            })
        }
        await Expense.findByIdAndDelete(_id)
        res.status(200).json({
            status: 'success',
            errors: 'Deleted Expense'
        })

    } catch (error) {
        return res.status(404).json({
            status: 'failed',
            errors: error.message
        })
    }
}