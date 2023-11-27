const { model, Schema } = require('mongoose');


const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    followers: [
        {
            userId: String,
            createdAt: String
        }
    ],
},{ timestamps: true });


const User = model('User', userSchema);

module.exports = User;