const express = require('express');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');


/**
 * Assigns to PORT the value of the environment variable PORT if in a production
 * environment.
 * Otherwise PORT is defaulted to 3000.
 */
const PORT = process.env.PORT || 3000;
const app = express();

/**
 * Wires the Router instances to their base URI by registering them as
 * middleware.
 */
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

/**
 * Initiates an HTTP server on port ${PORT}.
 * Internally calls createServer from the http module and passes itself
 * as the incoming requests handler. Then it starts the server listening on port
 * ${PORT}:
 * ->   http.createServer(app).listen(PORT, callback);
 */
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
