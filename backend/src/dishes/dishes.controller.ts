const express = require('express');
const router = express.Router();
const dishService = require('./dishes.service');
const authorize = require('../authorize')

// routes
router.post('/dishes', authorize(['CASSIERE']), create);
router.get('/dishes', authorize(['CASSIERE', 'CAMERIERE']), getAll);
router.get('/dishes/:id', authorize(['CASSIERE', 'CAMERIERE']), getById);
router.put('/dishes/:id', authorize(['CASSIERE']), update);
router.delete('/dishes/:id', authorize(['CASSIERE']), _delete);

module.exports = router;

function create(req:any, res:any, next:any) {
    dishService.create(req.body)
        .then(() => res.json({}))
        .catch((err: any) => next(err));
}

function getAll(req:any, res:any, next:any) {
    dishService.getAll()
        .then((dishes: any) => res.json(dishes))
        .catch((err: any) => next(err));
}

function getById(req:any, res:any, next:any) {
    dishService.getById(req.params.id)
        .then((user: any) => user ? res.json(user) : res.sendStatus(404))
        .catch((err: any) => next(err));
}

function update(req:any, res:any, next:any) {
    dishService.update(req.params.id, req.body)
        .then(() => res.json())
        .catch((err: any) => next(err));
}

function _delete(req:any, res:any, next:any) {
    dishService.delete(req.params.id)
        .then(() => res.json({}))
        .catch((err: any) => next(err));
}

export{}