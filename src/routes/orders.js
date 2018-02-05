const { Router } = require('express');

const OrdersController = require('../controllers/orders');


// Creates a router instance.
const router = new Router();

// Handles incoming HTTP GET requests to /orders.
router.get('/', OrdersController.getAll);

// Handles incoming HTTP POST requests to /orders.
router.post('/', OrdersController.createOrder);

// Handles incoming HTTP GET requests to /orders/:id.
router.get('/:id', OrdersController.getOne);

// Handles incoming HTTP DELETE requests to /orders/:id.
router.delete('/:id', OrdersController.deleteOrder);


// Exports the router so we can wire it to the /orders route within Express.
module.exports = router;
