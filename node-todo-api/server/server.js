require('./config/config'); 
// const mongoose = require('./db/mongoose'); 
const {User} = require('./models/user.js');
const {Todo} = require('./models/todo.js');
const express = require('express'); 
const bodyparser = require('body-parser'); 
const {mongoose} = require('./db/mongoose'); 
const _ = require('lodash'); 
var {authenticate} = require('./middleware/authenticate'); 

const app = express(); 
const port = process.env.PORT;

app.use(bodyparser.json());

app.get("/", (req, res)=>{
    res.send({message: "Welcome to my Todo application"}).status(200); 
});

app.post('/users', (req, res)=> {
    var body = _.pick(req.body, ['email', 'password']); 
    console.log(body); 
    var user = new User(body); 

    user.save().then(()=>{
        return user.generateAuthToken(); 
    }).then((token)=>{
        res.header({'x-auth':token}).send(user); 
    })
    .catch((e)=> {
        res.status(400).send(e); 
    }); 
}); 



app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user); 
}); 

// app.get('/users/me', (req, res)=>{
//     var token = req.header('x-auth'); 
//     console.log(token); 
//     User.findByToken(token).then((user)=>{
//         if(!user){
//             return Promise.reject(); 
//         }
//         res.send(user); 
//     })
//     .catch((e)=> {
//         res.status(401).send(); 
//     }); 
// }); 

app.post('/todos', (req, res)=> {
   //if the post request is successful send 200 request, 
   //else if the request is not successful due to some errors, sent a 400 bad request    
   var text = req.body.text;
   var todoNext = new Todo({
        'text':text
    });
    todoNext.save().then((docs)=>{
        res.status(200).json(docs); 
    })
    .catch((err)=> {
        res.status(400).send("Bad Request"); 
    });
});

app.get('/todos', (req, res)=> {

    Todo.find().then((docs)=> { 
        res.status(200).send({docs});
    })
    .catch((err)=>{
        res.status(400).send("Error in processing the request"); 
    })
}); 


app.get('/todos/:id', (req, res)=>{
    var todoId = req.params['id'];
    if(!mongoose.Types.ObjectId.isValid(todoId)){
        return res.status(400).send(); 
    }
    Todo.findOne({_id: todoId}).then((docs)=> {
        if(!docs){
            return res.status(404).send();
        }
        res.status(200).send({docs}); 
    })
    .catch((err)=> {
        res.status(400).send(); 
    }); 
});

app.patch('/todos/:id', (req, res)=>{
    var todoId = req.params['id']; 
    if(!mongoose.Types.ObjectId.isValid(todoId)){
        return res.status(400).send(); 
    }
    Todo.findByIdAndUpdate({_id:todoId}, {$set:{
        completed: true,
        completedAt: new Date().getTime()
    }}, {new:true}).then((docs)=>{
        if(!docs)
            return res.status(404).send();
        
        res.status(200).send(docs);
    })
});

app.get('/todos/delete/:id', (req, res)=>{
    var todoId = req.params['id']; 
    if(!mongoose.Types.ObjectId.isValid(todoId)){
        return res.status(400).send(); 
    }
    Todo.findOneAndRemove({_id: todoId}).then((docs)=>{
        if(!docs)
            return res.status(404).send()
        
        res.status(200).send({docs}); 
    })
    .catch((err)=>{
        res.status(400).send(); 
    });

});

app.listen(port, ()=>{
    console.log("Server start at port 3000")
});

module.exports = {
    app
};