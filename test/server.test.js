const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/server');
const Product = require('../src/models/product');
const { products, populateProducts } = require('./seed/seed');


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
                    expect(res.body.product._id).toBeDefined();
                    expect(res.body.product.name).toBe(product.name);
                    expect(res.body.product.price).toBe(product.price);
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

});