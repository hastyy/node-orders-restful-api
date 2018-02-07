const _ = require('lodash');
const { isEmail } = require('validator');

const User = require('../models/user');


const UsersController = {};

/**
 * Picks the 'email' and 'password' properties on the request body and tries
 * to instantiate a new User with those. If the picked fields meet the Schema
 * criteria, the new user is created and we'll try to save it to the database.
 * If the user is saved successfully (i.e. the account was created), we generate
 * and authentication token. Then we attach the token to the response headers
 * under the key 'X-Auth' and finally send the response to the user, containing
 * the auth token in the header and the newly created account data in the body.
 * The account data sent to the user is just a reduced view over the complete
 * user document.
 * 
 * Possbile HTTP responses:
 *  - 201 Created
 *  - 400 Bad Request
 *  - 409 Conflict
 */
UsersController.registerUser = async (req, res, next) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);

        const savedUser = await user.save();
        const token = await savedUser.generateAuthToken();

        res.header('X-Auth', token).status(201).send(user);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).send({ error: err });
        } else if (err.name === 'BulkWriteError') {
            res.status(409).send({
                error: new Error().message = 'Email already in use.'
            });
        } else {
            next(err);
        }
    }
};

/**
 * Picks the 'email' and 'password' properties on the request body and tries to
 * find a user matching those credentials.
 * If a matching user is found, we generate an authentication token. Then we 
 * attach the token to the response headers under the key 'X-Auth' and finally
 * send the response to the user, containing the auth token in the header and 
 * the user info in the body.
 * The user info sent to the user is just a reduced view over the complete
 * user document.
 * 
 * Possbile HTTP responses:
 *  - 201 Created
 *  - 400 Bad Request
 *  - 401 Unauthorized
 */
UsersController.signUserIn = async (req, res, next) => {
    try {
        const { email, password } = _.pick(req.body, ['email', 'password']);

        if (!email || !password || !isEmail(email))
            return res.status(400).send();
        
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();

        res.header('X-Auth', token).status(200).send(user);
    } catch (err) {
        // findByCredentials rejection throws no error
        if (!err) return res.status(401).send();

        next(err);
    }
};

/**
 * If we reach this controller method it means that the client passed
 * authentication. Because of this we will have to user instance and the token
 * string available in the request object, which were provided by the
 * authentication middleware.
 * Here we must delete the available token from the available user's token
 * collection.
 * 
 * Possbile HTTP responses:
 *  - 200 OK
 */
UsersController.signUserOut = async (req, res, next) => {
    try {
        const user = req.user;
        const token = req.token;

        await user.removeToken(token);
        res.status(200).send();
    } catch (err) {
        next(err);
    }
};


module.exports = UsersController;
