const OrdersController = {};

/**
 * Fetch all the documents from the Order collection and send it as an array
 * to the client.
 */
OrdersController.getAll = (req, res) => {
    res.status(200).send({
        message: 'Handling GET requests to /orders'
    });
};

/**
 * Saves the newly created order to the database.
 */
OrdersController.createOrder = (req, res) => {
    res.status(200).send({
        message: 'Handling POST requests to /orders',
        body: req.body
    });
};

/**
 * Return the order with id ${req.params.id} if one exists in the database.
 */
OrdersController.getOne = (req, res) => {
    res.status(200).send({
        message: `Handling GET requests to /orders/${req.params.id}`
    });
};

/**
 * Deletes the product with id ${req.params.id} from the database if such
 * document exists.
 */
OrdersController.deleteOrder = (req, res) => {
    res.status(200).send({
        message: `Handling DELETE requests to /orders/${req.params.id}`
    });
};


module.exports = OrdersController;
