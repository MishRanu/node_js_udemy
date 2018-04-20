const path = require('path'); 
const express = require('express');
const socketIO = require('socket.io'); 
const http = require('http'); 
const {generateMessage, generateLocationMessage} = require('./utils/message'); 

const publicPath = path.join(__dirname, '..\\public'); 
const port = process.env.PORT || 3000;

var app = express(); 
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath)); 

io.on('connection', function(socket){
    console.log('new user connected to the server'); 
    
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App')); 

    socket.on('createMessage', function(message, callback){
        console.log('Received a new message from', message.from); 
        callback("Received the message");
        io.emit('newMessage', generateMessage(message.from, message.text)); 
        }); 

    socket.on('createLocationMessage', function(message){
        console.log("Received location message", message.from); 
        io.emit('newLocationMessage', generateLocationMessage(message.from, message.latitude, message.longitude)); 
    })
});


server.listen(port, ()=> {
    console.log("Server is up on port 3000")
});
