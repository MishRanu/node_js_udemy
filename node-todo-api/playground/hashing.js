const {SHA256} = require('crypto-js'); 
const jwt = require('jsonwebtoken'); 

var data = { 
    id: 10
}
var token = jwt.sign(data, '123abc'); 
console.log(token); 

console.log(jwt.verify(token, "123abc")); 
// jwt.verify

var message = "I am user number 3"; 
var hash = SHA256(message).toString(); 

console.log(`Message: ${message}`); 
console.log(`Hash: ${hash}`); 

var data = {
    id: 4
}; 

var token = {
    data, 
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

token.data.id = 5;
var resultHash = SHA256(JSON.stringify(token.data)+ 'somesecret').toString(); 

if(resultHash===token.hash){
    console.log("Data was not changed"); 
    console.log(token.hash); 
}
else console.log("Data was changed. Do not trust! ");

//JSON web token: jwt makes it really easy to make it possible
