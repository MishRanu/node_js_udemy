const EventEmitter = require('events'); 

class MyEmitter extends EventEmitter{}

const myEmitter = new MyEmitter(); 

myEmitter.on('myevent', ()=>{
    console.log('an event occured'); 
});

myEmitter.on('event', function(a,b){
    console.log(a, b, this); 
}); 

myEmitter.emit('event', 'a', 'b'); 

console.log("before set time out");
setTimeout(()=>{
    myEmitter.emit('myevent'); 
}, 1500);

myEmitter.on('error', function(){
    console.error("Some error happened"); 
});

myEmitter.emit('error', new Error('whoops!!!'));