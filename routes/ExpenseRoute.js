const router = require('express').Router();

const expenseController = require('../controllers/ExpensesController')

router.get('/expenses', expenseController.get_expense)
router.get('/expense/:_id', expenseController.get_single_expense)
router.post('/expense', expenseController.post_expense)
router.put('/expense/:_id', expenseController.put_expense)
router.delete('/expense/:_id', expenseController.delete_expense)

module.exports = router;