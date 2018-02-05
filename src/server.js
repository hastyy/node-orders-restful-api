// Setup environment variables according to the execution environment.
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const logger = require('./middleware/logger');
const disableCORS = require('./middleware/cors-disabler');
const notFoundHandler = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handling');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');


/**
 * Assigns to PORT the value of the environment variable PORT if in a production
 * environment.
 * Otherwise PORT is defaulted to 3000.
 */
const PORT = process.env.PORT || 3000;
const app = express();

// Connect to the MongoDB database.
mongoose.connect(process.env.MONGODB_URI);

// Register a logging middleware. Disabled for testing environment.
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
    app.use(logger);
}

// Disables browsers CORS security mechanism.
app.use(disableCORS);

/**
 * The bodyParser middlewares parse the body of the incoming HTTP request into a
 * plain JavaScript object and make it available for the following middlewares
 * through the req.body property.
 * 
 * { extended: false } -> Do not parse extended bodies with rich-data in them.
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Wires the Router instances to their base URI by registering them as
 * middleware.
 */
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

/**
 * Registers middleware for exceptional situations like a request for an
 * unregistered route or an error thrown during the execution of a previous
 * middleware (being it predicted or unpredicted).
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Initiates an HTTP server on port ${PORT}.
 * Internally calls createServer from the http module and passes itself
 * as the incoming requests handler. Then it starts the server listening on port
 * ${PORT}:
 * ->   http.createServer(app).listen(PORT, callback);
 */
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));


// Export for testing purposes.
module.exports = app;
