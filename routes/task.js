const express = require('express');
const { createTask, getTasks,updateTask,deleteTask,getFilteredTasks } = require('../controllers/taskController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();


router.put('/:id', authenticateToken, updateTask);
router.get('/', authenticateToken, getFilteredTasks);
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;
