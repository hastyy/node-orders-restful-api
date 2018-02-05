const { Router } = require('express');

const ProductsController = require('../controllers/products');


// Gets a router instance.
const router = new Router();

// Handles incoming HTTP GET requests to /products.
router.get('/', ProductsController.getAll);

// Handles incoming HTTP POST requests to /products.
router.post('/', ProductsController.createProduct);

// Handles incoming HTTP GET requests to /products/:id.
router.get('/:id', ProductsController.getOne);

// Handles incoming HTTP PATCH requests to /products/:id.
router.patch('/:id', ProductsController.updateProduct);

// Handles incoming HTTP DELETE requests to /products/:id.
router.delete('/:id', ProductsController.deleteProduct);


// Exports the router so we can wire it to the /products route within Express.
module.exports = router;
