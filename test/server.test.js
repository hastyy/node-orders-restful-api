const expect = require('expect');
const request = require('supertest');

const app = require('../src/server');
const Product = require('../src/models/product');


beforeEach((done) => {
    Product.remove({}).then(() => done());
});

describe('ProductController', () => {

    describe('POST /products', () => {

        it('should create a new product', (done) => {
            const product = {
                name: 'Product X',
                price: 14.89
            };

            request(app)
                .post('/products')
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
                        const products = 
                            await Product.find({ name: product.name });

                        //expect(products.length).toBe(1);
                        expect(products[0].name).toBe(product.name);
                        expect(products[0].price).toBe(product.price);

                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });

    });

});