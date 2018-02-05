const _ = require('lodash');

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
 * 
 */
UsersController.signUserIn = (req, res) => {
    res.status(200).send({
        message: 'Handling POST requests to /users/signin'
    });
};

/**
 * 
 */
UsersController.signUserOut = (req, res) => {
    res.status(200).send({
        message: 'Handling DELETE requests to /users/signout'
    });
};


module.exports = UsersController;
