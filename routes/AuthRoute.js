const router = require('express').Router();

const AuthController = require('../controllers/AuthController')

router.post('/login', AuthController.post_user)
router.get('/user/:_id', AuthController.get_user)

module.exports = router;