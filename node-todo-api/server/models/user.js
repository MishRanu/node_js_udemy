const mongoose = require('mongoose'); 

var userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        minLength: 1, 
        trim: true
    },
    age: {
        type: Number
    }
});

var User = mongoose.model('User', userSchema);
module.exports = {
    User
};