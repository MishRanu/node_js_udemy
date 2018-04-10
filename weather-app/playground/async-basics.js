console.log('Starting app')

//registering a callback that takes place after 2 seconds
setTimeout(()=> {
    console.log("Inside of callback")
}, 2000)

setTimeout(()=>{
    console.log("second setTimeout")
}, 0)
console.log('Finishing app')