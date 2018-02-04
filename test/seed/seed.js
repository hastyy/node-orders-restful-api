const mongoose = require('mongoose');

const Product = require('../../src/models/product');


const products = [
    { 
        _id: new mongoose.Types.ObjectId(),
        name: 'PlayStation 4',
        price: 399.99
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: 'Nexus 5',
        price: 180
    }
];

const populateProducts = (done) => {
    Product.remove({})
        .then(() => Product.insertMany(products))
        .then(() => done())
        .catch((err) => done(err));
};


module.exports = {
    products,
    populateProducts
};
