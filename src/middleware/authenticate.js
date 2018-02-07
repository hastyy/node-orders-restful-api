const User = require('../models/user');


/**
 * Fetches the token and tries to find the bearer of the token.
 * If such user is found, we attach the identity of the user to the request
 * object in order to be able to access it in the following middlewares.
 * If the authentication process fails, we end the middleware chain here,
 * sending the response to the user to inform that they are not authenticated.
 */
module.exports = async (req, res, next) => {
    try {
        const token = req.header('X-Auth');
        const user = await User.findByToken(token);

        if (!user) return res.status(401).send();

        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError')
            return res.status(401).send();
        
        next(err);
    }
};