const express = require('express');
const { createProject, getProjects,deleteProject,updateProject } = require('../controllers/projectController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, createProject);
router.get('/', authenticateToken, getProjects);
router.put('/:id',authenticateToken,updateProject);
router.delete('/:id',authenticateToken,deleteProject);


module.exports = router;
