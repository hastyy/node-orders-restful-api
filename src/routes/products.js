const { Router } = require('express');

const ProductController = require('../controllers/products');


// Gets a router instance.
const router = new Router();

// Handles incoming HTTP GET requests to /products.
router.get('/', ProductController.getAll);

// Handles incoming HTTP POST requests to /products.
router.post('/', ProductController.createProduct);

// Handles incoming HTTP GET requests to /products/:id.
router.get('/:id', ProductController.getOne);

// Handles incoming HTTP PATCH requests to /products/:id.
router.patch('/:id', ProductController.updateProduct);

// Handles incoming HTTP DELETE requests to /products/:id.
router.delete('/:id', ProductController.deleteProduct);


// Exports the router so we can wire it to the /products route within Express.
module.exports = router;
