require('jquery');
require('mustache'); 

$(function(){

    var socket = io(); 
    var user = "Anurag Misra";
    var messagesList = $("#messagesList"); 
    var sendLocationButton = $("#sendLocation");
    var form = $("#messagesForm");
    
    sendLocationButton.on('click', function(){
        sendLocationButton.attr('disabled', 'disabled'); 
        navigator.geolocation.getCurrentPosition(function(res, err){
            if(err)
                sendLocationButton.removeAttr('disabled'); 
            else{
                var {latitude, longitude} = res.coords; 
                socket.emit('createLocationMessage', {
                    from: user,
                    latitude, 
                    longitude
                });
            }
        });
    });
    form.submit(function(event){
        event.preventDefault();
        var text = form.children('input:text').val();
        socket.emit('createMessage', {
            from: user,
            text: text
        }, function(data){
            console.log("Got it", data); 
        }); 
    }); 
    
    socket.on('connect', function(){
        console.log('Connection to the server established'); 
    });

    socket.on('newMessage', function(newMessage){

        var li = document.createElement("li");
        li.innerHTML = newMessage.text;
        messagesList.append(li); 
    });

    socket.on('newLocationMessage', function(newMessage){
        var li = document.createElement("li"); 
        var a = document.createElement("a"); 
        a.innerHTML= `${newMessage.from} send his location`;
        a.setAttribute('href', `https://www.google.com/maps?q=${newMessage.latitude},${newMessage.longitude}`);         
        li.append(a); 
        messagesList.append(li);
    });

    socket.on('disconnect', function(){
        console.log('connection to the server lost'); 
    });

});

