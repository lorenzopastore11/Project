const express = require('express');
const router = express.Router();
const orderService = require('./orders.service');
const authorize = require('../authorize')

// routes
router.post('/orders', authorize(['CAMERIERE']), create);
router.get('/orders/:orderId', authorize(['CASSIERE', 'CAMERIERE', 'CUOCO', 'BARISTA']), get);
router.delete('/orders', authorize(['CAMERIERE']), _delete);
router.put('/orders/:orderId', authorize(['CASSIERE', 'CAMERIERE', 'CUOCO', 'BARISTA']), update);

module.exports = router;

function create(req: any, res:any, next:any) {
    orderService.create(req.body)
        .then((order: any) => {
            return (order ? res.json(order) : res.status(400).json({ message: 'order does not exist' }))
        })
        .catch((err: any) => next(err));
}

function get(req: any, res:any, next:any) {
    orderService.get(req.params.orderId, req.header('Authorization'), res)
        .then((orders: any) => res.json(orders))
        .catch((err: any) => next(err));
}

function update(req:any, res:any, next:any) {
    orderService.update(req.params.orderId, req.body, req.query.id)
        .then((orders: any) => {
            
            return (res.json(orders))
            
        })
        .catch((err: any) => next(err));
}

function _delete(req:any, res:any, next:any) {
    orderService.delete(req.query.orderId, req.query.id)
        .then(() => res.json({}))
        .catch((err: any) => next(err));
}

export{}