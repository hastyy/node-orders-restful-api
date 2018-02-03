const _ = require('lodash');

const Product = require('../models/product');


const ProductController = {};

/**
 * Fetch all the documents from the Product collection and send it as an array
 * to the client.
 */
ProductController.getAll = (req, res) => {
    res.status(200).send({
        message: 'Handling GET requests to /products'
    });
};

/**
 * Pick the 'name' and 'price' properties from the request body and instanciate
 * a new Product with those.
 * Saves the newly created product to the database.
 */
ProductController.createProduct = async (req, res, next) => {
    try {
        const body = _.pick(req.body, ['name', 'price']);
        const product = new Product(body);

        const savedProduct = await product.save();
        res.status(201).send({
            product: savedProduct
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).send({ error: err });
        } else {
            next(err);
        }
    }
};

/**
 * Return the product with id ${req.params.id} if one exists in the database.
 */
ProductController.getOne = (req, res) => {
    res.status(200).send({
        message: `Handling GET requests to /products/${req.params.id}`
    });
};

/**
 * Updates the product with id ${req.params.id} if one exists in the database.
 */
ProductController.updateProduct = (req, res) => {
    res.status(200).send({
        message: `Handling PATCH requests to /products/${req.params.id}`,
        body: req.body
    });
};

/**
 * Deletes the product with id ${req.params.id} from the database if such
 * document exists.
 */
ProductController.deleteProduct = (req, res) => {
    res.status(200).send({
        message: `Handling DELETE requests to /products/${req.params.id}`
    });
};


module.exports = ProductController;
