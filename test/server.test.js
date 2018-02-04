const expect = require('expect');
const request = require('supertest');

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
                    console.log('My response:', res);
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

});