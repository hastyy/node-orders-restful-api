const express = require('express');

const productRoutes = require('./routes/products');


const PORT = process.env.PORT || 3000;
const app = express();

app.use('/products', productRoutes);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));