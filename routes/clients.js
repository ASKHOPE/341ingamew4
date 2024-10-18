const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients');
const {userValidation, validationResult } = require('../middleware/validator');
const { isAuthenticated } = require('../middleware/authenticate');


router.get('/', isAuthenticated,clientsController.getAll);

router.get('/:id', isAuthenticated, clientsController.getSingle);

router.post('/', isAuthenticated, userValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    clientsController.createclient(req, res, next);
});

router.put('/:id',isAuthenticated, userValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    clientsController.updateclient(req, res, next);
});

router.options('/:id', (req, res) => {
    res.set('Allow', 'PUT, PATCH, DELETE'); 
    res.send();
});

router.patch('/:id',isAuthenticated, userValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    clientsController.updateclient(req, res, next);
});

router.delete('/:id',isAuthenticated, clientsController.deleteclient);

module.exports = router;
