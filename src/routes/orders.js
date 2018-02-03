const { Router } = require('express');


// Gets a router instance.
const router = new Router();

// Handles incoming HTTP GET requests to /orders.
router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Handling GET requests to /orders'
    });
});

// Handles incoming HTTP POST requests to /orders.
router.post('/', (req, res) => {
    res.status(200).send({
        message: 'Handling POST requests to /orders'
    });
});

// Handles incoming HTTP GET requests to /orders/:id.
router.get('/:id', (req, res) => {
    res.status(200).send({
        message: `Handling GET requests to /orders/${req.params.id}`
    });
});

// Handles incoming HTTP DELETE requests to /orders/:id.
router.delete('/:id', (req, res) => {
    res.status(200).send({
        message: `Handling DELETE requests to /orders/${req.params.id}`
    });
});


// Exports the router so we can wire it to the /orders route within Express.
module.exports = router;
