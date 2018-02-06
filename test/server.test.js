const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/server');
const Product = require('../src/models/product');
const User = require('../src/models/user');
const {
    products,
    populateProducts,
    users,
    populateUsers
} = require('./seed/seed');


describe('ProductController', () => {

    const BASE_URI = '/products';

    beforeEach(populateProducts);

    describe('GET /products', () => {

        it('should get all products', (done) => {
            request(app)
                .get(BASE_URI)
                .expect(200)
                .expect((res) => {
                    expect(res.body.products.length).toBe(products.length);
                })
                .end(done);
        });

        it('should get all products named Nexus 5', (done) => {
            request(app)
                .get(`${BASE_URI}?name=Nexus 5`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.products.length).toBe(1);
                    expect(res.body.products[0].name).toBe('Nexus 5');
                })
                .end(done);
        });

    });

    describe('POST /products', () => {

        it('should create a new product', (done) => {
            const product = {
                name: 'Product X',
                price: 14.89
            };

            request(app)
                .post(BASE_URI)
                .send(product)
                .expect(201)
                .expect((res) => {
                    const newProduct = res.body;

                    expect(newProduct._id).toBeDefined();
                    expect(newProduct.name).toBe(product.name);
                    expect(newProduct.price).toBe(product.price);
                })
                .end(async (err, res) => {
                    if (err) return done(err);

                    try {
                        const foundProducts = 
                            await Product.find({ name: product.name });

                        expect(foundProducts.length).toBe(1);
                        expect(foundProducts[0].name).toBe(product.name);
                        expect(foundProducts[0].price).toBe(product.price);

                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });

        it('should not create new product with invalid body data', (done) =>{
            const invalidProduct = {};

            request(app)
                .post(BASE_URI)
                .send(invalidProduct)
                .expect(400)
                .end(async (err, res) => {
                    if (err) return done(err);

                    try {
                        const productsCount = await Product.find().count();
                        expect(productsCount).toBe(products.length);

                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });

    });

    describe('GET /products/:id', () => {

        it('should find the product with specified valid id', (done) => {
            request(app)
                .get(`${BASE_URI}/${products[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.name).toBe(products[0].name);
                    expect(res.body.price).toBe(products[0].price);
                })
                .end(done);
        });

        it('should not find the product with specified valid id', (done) => {
            const newId = new mongoose.Types.ObjectId();

            request(app)
                .get(`${BASE_URI}/${newId.toHexString()}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 Not Found for invalid id', (done) => {
            const invalidId = '123';

            request(app)
                .get(`${BASE_URI}/${invalidId}`)
                .expect(404)
                .end(done);
        });

    });

    describe('PATCH /products/:id', () => {

        it('should update the product with specified valid id', (done) => {
            const name = 'Nexus 6';
            const price = 230;

            request(app)
                .patch(`${BASE_URI}/${products[1]._id.toHexString()}`)
                .send({ name, price })
                .expect(200)
                .expect((res) => {
                    const updatedProduct = res.body;
                    
                    expect(updatedProduct.name).not.toBe('Nexus 5');
                    expect(updatedProduct.name).toBe(name);
                    expect(updatedProduct.price).toBe(price);
                })
                .end(async (err, res) => {
                    if (err) return done(err);

                    const count = 
                        await Product.find({ name: products[1].name }).count();
                    
                    expect(count).toBe(0);
                    done();
                });
        });

        it('should not update the product on invalid body data', (done) => {
            const invalidPrice = 'This is invalid';

            request(app)
                .patch(`${BASE_URI}/${products[1]._id.toHexString()}`)
                .send({ price: invalidPrice })
                .expect(400)
                .end(async (err, res) => {
                    if (err) return done(err);

                    const product = 
                        await Product.findOne({ name: products[1].name });
                    
                    expect(product.price).toBe(products[1].price);
                    done();
                });
        });

        it('should not find the product with specified valid id', (done) => {
            const newId = new mongoose.Types.ObjectId();

            request(app)
                .patch(`${BASE_URI}/${newId.toHexString()}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 Not Found for invalid id', (done) => {
            const invalidId = '123';

            request(app)
                .patch(`${BASE_URI}/${invalidId}`)
                .send({})
                .expect(404)
                .end(done);
        });

    });

    describe('DELETE /products/:id', () => {

        it('should remove the product with specified valid id', (done) => {
            const id = products[0]._id.toHexString();

            request(app)
                .delete(`${BASE_URI}/${id}`)
                .expect(200)
                .expect((res) => {
                    const deletedProduct = res.body;

                    expect(deletedProduct._id).toBe(id);
                    expect(deletedProduct.name).toBe(products[0].name);
                    expect(deletedProduct.price).toBe(products[0].price);
                })
                .end(async (err, res) => {
                    if (err) return done(err);

                    const [product, count] = await Promise.all([
                        Product.findById(id),
                        Product.find().count()
                    ]);

                    expect(product).toBeFalsy();
                    expect(count).toBe(products.length - 1);

                    done();
                });
        });

        it('should not find the product with specified valid id', (done) => {
            const newId = new mongoose.Types.ObjectId();

            request(app)
                .delete(`${BASE_URI}/${newId.toHexString()}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 Not Found for invalid id', (done) => {
            const invalidId = '123';

            request(app)
                .delete(`${BASE_URI}/${invalidId}`)
                .expect(404)
                .end(done);
        });

    });

});

describe('UsersController', () => {

    const BASE_URI = '/users';

    beforeEach(populateUsers);

    describe('POST /users', () => {

        it('should create a user', (done) => {
            const email = 'example@example.com';
            const password = '123mnb!';

            request(app)
                .post(BASE_URI)
                .send({ email, password })
                .expect(201)
                .expect((res) => {
                    const newUser = res.body;

                    expect(res.headers['x-auth']).toBeDefined();
                    expect(newUser._id).toBeDefined();
                    expect(newUser.email).toBe(email);
                })
                .end(async (err, res) => {
                    if (err) done(err);

                    const user = await User.findOne({ email });
                    expect(user).toBeDefined();
                    expect(user.password).not.toBe(password);

                    const count = await User.find().count();
                    expect(count).toBe(users.length + 1);

                    done();
                });
        });

        it('should not create user with invalid email/password', (done) => {
            const email = 'invalid-email.com';
            const password = '';

            request(app)
                .post(BASE_URI)
                .send({ email, password })
                .expect(400)
                .end(async (err, res) => {
                    if (err) return done(err);

                    const count = await User.find().count();
                    expect(count).toBe(users.length);

                    done();
                });
        });

        it('should not create user if email in use', (done) => {
            const { email, password } = users[0];

            request(app)
                .post(BASE_URI)
                .send({ email, password })
                .expect(409)
                .end(async (err, res) => {
                    if (err) return done(err);

                    const count = await User.find().count();
                    expect(count).toBe(users.length);

                    done();
                });
        });

    });

});
