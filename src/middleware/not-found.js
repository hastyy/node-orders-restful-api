/**
 * This middleware will run if no other handler was found for the incoming
 * request, i.e. the client made a request to an unregistered URI.
 * We create a 'Not Found' error and pass it to next in order to effectively
 * pass control to the error-handling middleware.
 */
module.exports = (req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;

    next(err);
};
