const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const { userValidation, validationResult } = require('../middleware/validator');
const { isAuthenticated } = require('../middleware/authenticate');


router.get('/', isAuthenticated,userController.getAll);

router.get('/:id',isAuthenticated, userController.getSingle);

router.post("/",isAuthenticated, userValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    userController.createUser(req, res, next);
});

router.put("/:id",isAuthenticated, userValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    userController.updateUser(req, res, next);
});

router.options('/:id', (req, res) => {
    res.set('Allow', 'PUT, PATCH, DELETE');
    res.send();
});

router.patch("/:id",isAuthenticated, userValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    userController.updateUser(req, res, next);
});

router.delete("/:id",isAuthenticated, userController.deleteUser);

module.exports = router;
