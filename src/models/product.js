/**
 * Requiring something a second or n-th time has no overhead because of
 * require's internal caching system.
 * For the double require('mongoose') above, this means that the first one
 * might run the module code (if it wasn't yet require in another part of the
 * application) but the second require will simply return the reference of the
 * firstly returned object.
 */
const mongoose = require('mongoose');
const { Schema } = require('mongoose');


/**
 * The Schema defines the shape of the documents (objects) within a given
 * collection.
 * 
 * Here we define how a Product instance/document should look like inside of
 * the Product Collection in our MongoDB database.
 */
const productSchema = new Schema({
    name: String,
    price: Number
});

/**
 * Models are fancy constructors compiled from our Schema definitions.
 * Instances of these models represent documents which can be saved and
 * retrieved from our database.
 * All document creation and retrieval from the database is handled by these 
 * models.
 * 
 * Here we define the Product model from the productSchema, which we will use
 * throughout our application as we use classes to instantiate products.
 */
const Product = mongoose.model('Product', productSchema);


module.exports = Product;
