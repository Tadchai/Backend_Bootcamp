const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const csrfMiddleware = require('../middlewares/csrfMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', authMiddleware, csrfMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, csrfMiddleware, userController.getUserById);
router.post('/', authMiddleware, csrfMiddleware, userController.createUser);
router.put('/:id', authMiddleware, csrfMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, csrfMiddleware, userController.deleteUser);

module.exports = router;
