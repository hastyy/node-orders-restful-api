/**
 * Requiring something a second or n-th time has no overhead because of
 * require's internal caching system.
 * For the double require('mongoose') below, this means that the first one
 * might run the module code (if it wasn't yet require in another part of the
 * application) but the second require will simply return the reference of the
 * firstly returned object.
 */
const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const orderEntrySchema = new Schema({
    _product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

/**
 * The Schema defines the shape of the documents (objects) within a given
 * collection.
 * 
 * Here we define how an Order instance/document should look like inside of
 * the Order Collection in our MongoDB database.
 */
const orderSchema = new Schema({
    products: {
        type: [orderEntrySchema],
        required: true
    },
    _buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

/**
 * Models are fancy constructors compiled from our Schema definitions.
 * Instances of these models represent documents which can be saved and
 * retrieved from our database.
 * All document creation and retrieval from the database is handled by these 
 * models.
 * 
 * Here we define the Order model from the orderSchema, which we will use
 * throughout our application as we use classes to instantiate orders.
 */
const Order = mongoose.model('Order', orderSchema);


module.exports = Order;
