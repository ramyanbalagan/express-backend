const router = require('express').Router();
const { authenticateJWT } = require('../middlewares/JWT')
const taskController = require('../controllers/TasksController')

router.get('/tasks', authenticateJWT,taskController.get_task)
router.post('/task', authenticateJWT, taskController.post_task)
router.put('/task/:_id', authenticateJWT, taskController.put_task)
router.delete('/task/:_id', authenticateJWT, taskController.delete_task)

module.exports = router;