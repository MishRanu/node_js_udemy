const mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;
mongoose.PromiseProvider = global.PromiseProvider;
mongoose.connect("mongodb://localhost:27017/TodoApp");

module.exports = {
    mongoose
};