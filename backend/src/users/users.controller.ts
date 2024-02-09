const express = require('express');
const router = express.Router();
const userService = require('./users.service');
const authorize = require('../authorize');

router.post('/login', authenticate);
router.post('/register', register);
router.get('/users/check', check);
router.get('/users/:id', authorize(['CASSIERE']), get);
router.put('/users/:id', authorize(['CASSIERE']), update);
router.delete('/users/:id', authorize(['CASSIERE']), _delete);

module.exports = router;

function authenticate(req: any, res: any, next: any) {
    userService.authenticate(req.body)
       .then((user: any) => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
       .catch((err: any) => next(err));
}

function register(req: any, res: any, next: any) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch((err: any) => next(err));
}

function check(req: any, res: any, next: any) {
    userService.check()
        .then((users: any) => users ? res.json(true) : res.json(false))
        .catch((err: any) => next(err));
}

function get(req: any, res: any, next: any) {
    userService.get(req.params.id, req.query.query)
        .then((user: any) => {user ? res.json(user) : res.sendStatus(404)})
        .catch((err: any) => next(err));
}

function update(req: any, res: any, next: any) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch((err: any) => next(err));
}

function _delete(req: any, res: any, next: any) {
    console.log(req.params.id)
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch((err: any) => next(err));
}

export{}