/**
 * Middleware in this file will only run if an error is passed to a call of
 * next (by other middlewares) or an (unexpected) error is thrown on runtime.
 */

 
// Logs the stack trace to the console if an unexpected error was thrown.
const errorLoggingMiddleware = (err, req, res, next) => {
    if (!err.status || err.status === 500)
        console.error(err.stack);

    next(err);
};

/**
 * Handles the (thrown) error accordingly sending a proper response to the
 * client.
 * This code will run for expected errors (probably passed to next by other
 * middlewares) or unexpected errors thrown during runtime.
 */
const errorHandlingMiddleware = (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            message: err.message || 'Something went wrong.'
        }
    });
};


/**
 * Exports the error handling middlewares sequentially in an array as a way
 * to compose them and preserve their order of execution.
 * This means that we will be registering all these middlewares to express
 * in a single .use call passing the array, and their order in the array will
 * be the registration order.
 */
module.exports = [
    errorLoggingMiddleware,
    errorHandlingMiddleware
];
