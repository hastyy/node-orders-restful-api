/**
 * CORS: Cross-Origin Resource Sharing
 * Security measure implemented by browser (only browsers) which prevents web
 * pages that where served from server X to make requests to server Y.
 * 
 * This middleware disables this mechanism by setting some headers on the
 * response, so that the browsers knows we allow other origin clients to make
 * requests to our server.
 */
module.exports = (req, res, next) => {
    // Give access to any origin.
    res.header('Access-Control-Allow-Origin', '*');

    // Defines which headers are allowed to be sent along with the request.
    const allowedHeaders = [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ];
    res.header(
        'Access-Control-Allow-Headers',
        allowedHeaders.join(', ')
    );

    /**
     * The browser will (always) send an OPTIONS request first when the client
     * tries to send a request.
     * This is meant for the browser to know which HTTP methods are allowed by
     * the server.
     * This only happens in the context of a CORS client->server interaction.
     */
    if (req.method === 'OPTIONS') {
        const allowedMethods = ['GET', 'POST', 'PATCH', 'DELETE'];
        res.header('Access-Control-Allow-Methods', allowedMethods.join(', '));

        return res.status(200).send();
    }

    next();
};