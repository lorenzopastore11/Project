const express = require('express');
const router = express.Router();
const tableService = require('./tables.service');
const authorize = require('../authorize');

// routes
router.post('/tables', authorize(['CASSIERE']), create);
router.get('/tables', authorize(['CASSIERE', 'CAMERIERE']), getAll);
router.get('/tables/:id', authorize(['CASSIERE', 'CAMERIERE']), getById);
router.put('/tables/:id', authorize(['CASSIERE']), update);
router.delete('/tables/:id', authorize(['CASSIERE']), _delete);

module.exports = router;

function create(req:any, res:any, next:any) {
    tableService.create(req.body)
        .then((table: any) => table ? res.json(table) : res.status(400).json({ message: 'Table does not exist' }))
        .catch((err: any) => next(err));
}

function getAll(req:any, res:any, next:any) {
    tableService.getAll(req.query.username, req.header('Authorization'), res)
        .then((tables: any) => res.json(tables))
        .catch((err: any) => next(err));
}

function getById(req:any, res:any, next:any) {
    tableService.getById(req.params.id)
        .then((table: any) => table ? res.json(table) : res.sendStatus(404))
        .catch((err: any) => next(err));
}

function update(req:any, res:any, next:any) {
    tableService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch((err: any) => next(err));
}

function _delete(req:any, res:any, next:any) {
    tableService.delete(req.params.id)
        .then(() => res.json({}))
        .catch((err: any) => next(err));
}

export{}