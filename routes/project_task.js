const express = require('express');
const { createTask, getTasks,updateTask,deleteTask,getFilteredTasks } = require('../controllers/taskController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.post('/:projectId/tasks', authenticateToken, createTask);
router.get('/:projectId/tasks', authenticateToken, getTasks);


module.exports=router