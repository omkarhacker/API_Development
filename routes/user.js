const express = require('express');
const { createUser, loginUser, getUsers,updateUser,deleteUser } = require('../controllers/userController');
const router = express.Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
