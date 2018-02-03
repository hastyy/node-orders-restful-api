const { Router } = require('express');


// Router for root url /products
const router = new Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});


module.exports = router;