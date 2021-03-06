const mongoose = require('mongoose'); 
const validator = require('validator'); 
const jwt = require('jsonwebtoken'); 
const _ = require('lodash'); 
const bcrypt = require('bcryptjs'); 

var UserSchema = mongoose.Schema({
    email: {
        type: String, 
        required: [true, 'User email id is required'], 
        trim: true,
        unique: true, 
        validate: {
            validator: validator.isEmail, 
            message: '{VALUE} is not a valid email address.'
        }
    },
    password: {
        type: String, 
        require: true,
        minlength: 6  
    }, 
    tokens: [{
        access: {
            type: String, 
            required: true
        }, 
        token:{
            type: String, 
            required: true
        }
    }]
});

UserSchema.method('toJSON', function(){
    var user = this; 
    var userObject = user.toObject(); 
    return _.pick(userObject, ['_id', 'email']); 
});

UserSchema.method('generateAuthToken', function(){
    var user = this; 
    var access = 'auth'; 
    var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString(); 
    user.tokens = user.tokens.concat([{access, token}]); 
    return user.save().then(()=>{
        return token; 
    }); 
});

UserSchema.static('findByToken', function(token){
    var User = this; 
    var decoded; 
    try{
        decoded = jwt.verify(token, "abc123");
        console.log("decoded", decoded); 
    }
    catch(e) {
        return Promise.reject(); 
    }

    return User.findOne({
        "_id": decoded._id, 
        "tokens.token":token, 
        "tokens.access": "auth"
    })
}); 

UserSchema.method('removeToken', function(token){
    var user= this; 

    return user.update({
        $pull: {
            tokens:{token}
        }
    }); 
});

UserSchema.static('findByCredentials', function(email, password){
    var User = this; 
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject(); 
        }
        return new Promise((resolve, reject)=> {
            bcrypt.compare(password, user.password, (err, res)=>{
                if(res){
                    resolve(user); 
                }
                reject(err); 
            });
        });
    });
})

UserSchema.pre('save', function(next){
    var user = this; 
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(user.password, salt, function(err, hash){
                user.password = hash; 
                next(); 
            });
        });
    }
    else{
        next(); 
    }
}); 

var User = mongoose.model('User', UserSchema); 

module.exports = {
    User
};