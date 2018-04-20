// require('moment');
// require('jquery');
// require('mustache'); 

$(function(){

    var socket = io(); 
    var user = "Anurag Misra";
    var messagesList = $("#messagesList"); 
    var sendLocationButton = $("#sendLocation");
    var form = $("#messagesForm");
    
    // function scrollToBottom(){
    //     var newMessage = messagesList.children['div:last-child'];
    //     //Heights
    //     var clientHeight = messagesList.prop('clientHeight'); 
    //     var scrollTop = messagesList.prop('scrollTop'); 
    //     var scrollHeight = messages.prop('scrollHeight'); 
    //     var newMessageHeight = newMessage.innerHeight(); 
    //     var lastMessageHeight = newMessage.prev().innerHeight();

    //     if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=scrollHeight){
    //         console.log('schould scroll'); 
    //     }
    // }

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
                }, function(data){
                    console.log("Acknowledgemnt for sent weather"); 
                    sendLocationButton.removeAttr('disabled'); 
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

    socket.on('newMessage', function(message){
        var messageTemplate = $("#messageTemplate").html();
        var createdAt = moment(message._createdAt).format("hh:mm a");
        var data = {
            from: message.from, 
            createdAt: createdAt, 
            text: message.text
        }; 
        var rendered = Mustache.render(messageTemplate, data);
        messagesList.append(rendered);
    });

    socket.on('newLocationMessage', function(message){
        var locationMessageTemplate = $("#locationMessageTemplate").html();
        var createdAt = moment(message._createdAt).format("hh:mm a"); 
        var rendered = Mustache.render(locationMessageTemplate, {
            from: message.from, 
            createdAt: createdAt, 
            url: `https://www.google.com/maps?q=${message.latitude},${message.longitude}`
        });
        messagesList.append(rendered);
    });

    socket.on('disconnect', function(){
        console.log('connection to the server lost'); 
    });

});

