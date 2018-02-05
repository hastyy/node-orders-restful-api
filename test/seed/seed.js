const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Product = require('../../src/models/product');
const User = require('../../src/models/user');


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

const access = 'auth';
const secret = process.env.JWT_SECRET;
const userOneId = new mongoose.Types.ObjectId();
const userOneData = { access, _id: userOneId.toHexString() };
const userOneToken = jwt.sign(userOneData, secret);
const userTwoId = new mongoose.Types.ObjectId();
const userTwoData = { access, _id: userTwoId.toHexString() };
const userTwoToken = jwt.sign(userTwoData, secret);
const users = [
    {
        _id: userOneId,
        email: 'userOne@example.com',
        password: 'f2Av6Y!m',
        tokens: [
            { access, token: userOneToken.toString() }
        ]
    },
    {
        _id: userTwoId,
        email: 'userTwo@example.com',
        password: 'fM7v2Bvg9Kn',
        tokens: [
            { access, token: userTwoToken.toString() }
        ]
    }
];

const populateProducts = (done) => {
    Product.remove({})
        .then(() => Product.insertMany(products))
        .then(() => done())
        .catch((err) => done(err));
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            const userOne = new User(users[0]);
            const userTwo = new User(users[1]);

            /* We use Promise.all with the save() call for each user instead
            of using User.insertMany() because the latter prevents every
            middleware hook attached to the save operation from running.
            This means that the pre save middleware to hash the passwords would
            not run and thus the passwords would be stored as plain text in the
            database. */
            return Promise.all([ userOne.save(), userTwo.save() ])
        })
        .then(() => done());
};


module.exports = {
    products,
    populateProducts,
    users,
    populateUsers
};
