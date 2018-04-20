const path = require('path'); 
const express = require('express');
const socketIO = require('socket.io'); 
const http = require('http'); 
const {generateMessage, generateLocationMessage} = require('./utils/message'); 
const {isValidName} = require('./utils/isValidName'); 
const {Users} = require('./users/users'); 
const publicPath = path.join(__dirname, '..\\public'); 
const port = process.env.PORT || 3000;

var app = express(); 
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users(); 

app.use(express.static(publicPath)); 
io.on('connection', function(socket){
    console.log('new user connected to the server'); 
    
    socket.on('connectChatRoom', function(params, callback){
        var username = isValidName(params.username); 
        var room = isValidName(params.room); 
        if(username && room){
            socket.join(room, (err)=>{
                if(err)
                    console.log(`${username} could not add to ${room}`);
                else console.log(socket.rooms);
            });

            console.log(users.addUser(socket.id, username, room));
            console.log(users); 
            socket.emit('newMessage', generateMessage(username, `Welcome to ${room}`)); 
            socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${username} joined the chat`));
        }
        else{
            callback("bad username"); 
        }
    });

    socket.on('createMessage', function(message, callback){
        var user = users.getUser(socket.id); 
        console.log(user); 
        console.log('Received a new message from', user.username);         
        io.to(user.room).emit('newMessage', generateMessage(user.username, message.text)); 
        callback("Received the message");
    });

    socket.on('createLocationMessage', function(message, callback){
        var user = users.getUser(socket.id);
        console.log("Received location message", user.username); 
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.username, message.latitude, message.longitude)); 
        callback("Received the location message"); 
    })
});


server.listen(port, ()=> {
    console.log("Server is up on port 3000")
});
