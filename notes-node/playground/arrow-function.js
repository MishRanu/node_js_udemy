// var square = (x) => {
//     var result = x*x;
//     return result; 
// };

var square = x => x*x; 
console.log(square(9))

//Difference between arrow function and normal function 

var user = {
    name: 'Andrew', 
    sayHi: () => {
        console.log(arguments)
        console.log(`Hi, I 'm ${this.name}`); 
    },
    sayHiAlt () { 
        console.log(arguments)
        console.log(`Hi I'm ${this.name}`)
    }
}; 

//Use simplified functions when you are creating functions on a object due to this binding
//with array functions that can be confusing

user.sayHi(1,2,3); 