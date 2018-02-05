const { Router } = require('express');

const UsersController = require('../controllers/users');


// Creates a router instance.
const router = new Router();

// Handles incoming HTTP POST requests to /users.
router.post('/', UsersController.registerUser);

// Handles incoming HTTP POST requests to /users/signin.
router.post('/signin', UsersController.signUserIn);

// Handles incoming HTTP DELETE requests to /users/signout.
router.delete('/signout', UsersController.signUserOut);


// Exports the router so we can wire it to the /users route within Express.
module.exports = router;
