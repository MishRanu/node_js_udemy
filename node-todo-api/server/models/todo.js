const mongoose = require('mongoose'); 

var todoSchema = mongoose.Schema({
    text: {
        type: String,
        minlength: 1, 
        trim: true, 
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number, 
        default: null
    }, 
    _creator: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    }
});

var Todo = mongoose.model('Todo', todoSchema); 

module.exports = { 
    Todo
};