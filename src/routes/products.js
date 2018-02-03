const { Router } = require('express');


// Gets a router instance.
const router = new Router();

// Handles incoming HTTP GET requests to /products.
router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Handling GET requests to /products'
    });
});

// Handles incoming HTTP POST requests to /products.
router.post('/', (req, res) => {
    res.status(200).send({
        message: 'Handling POST requests to /products'
    });
});

// Handles incoming HTTP GET requests to /products/:id.
router.get('/:id', (req, res) => {
    res.status(200).send({
        message: `Handling GET requests to /products/${req.params.id}`
    });
});

// Handles incoming HTTP PATCH requests to /products/:id.
router.patch('/:id', (req, res) => {
    res.status(200).send({
        message: `Handling PATCH requests to /products/${req.params.id}`
    });
});

// Handles incoming HTTP DELETE requests to /products/:id.
router.delete('/:id', (req, res) => {
    res.status(200).send({
        message: `Handling DELETE requests to /products/${req.params.id}`
    });
});


// Exports the router so we can wire it to the /products route within Express.
module.exports = router;
