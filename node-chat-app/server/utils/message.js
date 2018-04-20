const moment = require('moment'); 

var generateMessage = (from, text)=>{
    return {
        from, 
        text, 
        _createdAt: moment().valueOf()
    }
};

var generateLocationMessage = (from, latitude, longitude)=>{
    return { 
        from, 
        latitude, 
        longitude, 
        _createdAt: moment().valueOf()
    }
}; 
module.exports = {
    generateMessage, 
    generateLocationMessage
}