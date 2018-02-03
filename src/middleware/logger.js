const morgan = require('morgan');


// TODO: Improve the logger implementation, potentially making it avaiable
// throughout all the middleware chain

module.exports = morgan('dev');