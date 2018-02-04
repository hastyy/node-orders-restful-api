const _ = require('lodash');
const { ObjectID } = require('mongodb');

const Product = require('../models/product');


const ProductController = {};

/**
 * Fetch all the documents from the Product collection and send it as an array
 * to the client.
 * The response is an object containing the products array instead of the plain
 * array because we want flexibility to add more data to the response any time
 * later.
 * The client might specify some fetching criterias through a querystring, which
 * might narrow the presented results (i.e. /products?name=X&price=Y). Only
 * productSchema properties will be considered, the rest will be ignored.
 * Any API user can see every product.
 * 
 * Possible HTTP responses:
 *  - 200 OK
 */
ProductController.getAll = async (req, res, next) => {
    try {
        const criteria = _.pick(req.query, ['name', 'price']);
        const products = await Product.find(criteria);

        res.status(200).send({ products });
    } catch (err) {
        next(err);
    }
};

/**
 * Pick the 'name' and 'price' properties from the request body and instanciate
 * a new Product with those.
 * Saves the newly created product to the database if it meets all of the
 * Schema criteria.
 * TODO: Only system admins should be able to create products (i.e. store 
 * managers).
 * 
 * Possible HTTP responses:
 *  - 201 Created
 *  - 400 Bad Request
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
 * Find the product with id ${req.params.id} in the Product collection and if
 * the product is found, send it to the client.
 * Any API user can see a specified product.
 * 
 * Possible HTTP responses:
 *  - 200 OK
 *  - 404 Not Found
 */
ProductController.getOne = async (req, res, next) => {
    try {
        if (!ObjectID.isValid(req.params.id))
            return res.status(404).send();

        const id = req.params.id;
        const product = await Product.findById(id);

        if (product === null)
            return res.status(404).send();
        
        res.status(200).send(product);
    } catch (err) {
        next(err);
    }
};

/**
 * Updates the product with id ${req.params.id} in the Product collection, if
 * such product exists, and sends the updated product back to the client.
 * TODO: Only system admins should be able to create products (i.e. store 
 * managers).
 * 
 * Possible HTTP responses:
 *  - 201 Created
 *  - 400 Bad Request
 *  - 404 Not Found
 */
ProductController.updateProduct = async (req, res, next) => {
    try {
        if (!ObjectID.isValid(req.params.id))
            return res.status(404).send();
        
        const id = req.params.id;
        const updateProps = _.pick(req.body, ['name', 'price']);
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updateProps },
            { new: true }   // return the updated document
        );

        if (updatedProduct === null)
            return res.status(404).send();
        
        res.status(200).send(updatedProduct);
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(400).send({ error: err });
        } else {
            next(err);
        }
    }
};

/**
 * Deletes the product with id ${req.params.id} from the database if such
 * document exists.
 * It only the newly created product to the database if it meets all of the
 * Schema criteria.
 */
ProductController.deleteProduct = (req, res) => {
    res.status(200).send({
        message: `Handling DELETE requests to /products/${req.params.id}`
    });
};


module.exports = ProductController;
