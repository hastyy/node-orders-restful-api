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
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');


const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    access: {
        type: String,
        required: true
    }
});

/**
 * The Schema defines the shape of the documents (objects) within a given
 * collection.
 * 
 * Here we define how an User instance/document should look like inside of
 * the User Collection in our MongoDB database.
 */
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 6
        // TODO: Validator to require better password strength
    },
    tokens: [tokenSchema]
});

/**
 * Schema.methods is a special property of Schema where we can register
 * functions as methods to be available in the instances of the model using
 * this schema.
 * In this case we must use the regular function syntax instead of an arrow
 * function because of the 'this' reference binding. If we used an arrow
 * function, 'this' would point to the global object. Using a regular function,
 * 'this' points to the Model instance (user) calling the method. To avoid
 * confusion throughout the method logic, we initially assign 'this' to a more
 * evident constant 'user'. 'user' will replace 'this' in our logic.
 * 
 * This method generates an authentication token to the user document/account on
 * which we are calling this method.
 * The token generated is a JSON Web Token. A JWT string is composed of three
 * different parts, each separated by a '.', and these are:
 *  1. Header: contains information such as the hashing algorithm used to
 *      produce the token.
 *  2. Payload: contains the data object we embed on the token. This should
 *      identify who's making the request.
 *  3. Signature/Hash: Is the resulting string from applying the hashing
 *      algorithm specified on the Header to the resulting raw string of
 *      concatenating:
 *          - the Payload
 *          - a secret string that only the server knows
 * The Header and the Payload are publicly viewable data, they are not
 * encrypted in any way. To prove this we can insert a generated JWT in the
 * encoded box on https://jwt.io/ to see the decoded representation.
 * Technically a malicious agent could alter the payload data to identify itself
 * as someone else. This isn't possbible though because as said above, the
 * Signature is generated through the concatenation of the Payload and some
 * secret. To make this kind of attack work, the malicious agent would have to
 * alter the Payload and the Signature aswell in order for them to match. But
 * the agent can't do that because he doesn't know the secret.
 * 
 * Method implementation:
 * Data is an object that contains the user information we want to be exchanging
 * back and forth with the client, so that they can indentify themselves when
 * making a request. This will be (part of) the token payload.
 * We use jwt.sign() to generate a token, passing to it the data that identifies
 * the user and the secret to sign the token.
 * Having the token, we push it to the tokens array on the user document and
 * save the document back to the database.
 * We wait for the save() to return successfully and then return the token.
 * 
 * We aren't using a try/catch block because if an error is thrown we don't want
 * to catch it here. The best behaviour is to set the app in the path of sending
 * a 500 Internal Server Error to the client.
 */
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const access = 'auth';
    const data = { access, _id: user._id.toHexString() };
    const token = jwt.sign(data, process.env.JWT_SECRET).toString();

    user.tokens.push({ access, token });
    await user.save();

    return token;
};

/**
 * Models are fancy constructors compiled from our Schema definitions.
 * Instances of these models represent documents which can be saved and
 * retrieved from our database.
 * All document creation and retrieval from the database is handled by these 
 * models.
 * 
 * Here we define the User model from the userSchema, which we will use
 * throughout our application as we use classes to instantiate users.
 */
const User = mongoose.model('User', userSchema);


module.exports = User;
