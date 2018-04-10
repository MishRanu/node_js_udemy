const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            demand: true, 
            alias: 'address', 
            describe: 'Address to fetch', 
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv; 

var encodedAddress = encodeURIComponent(argv.address);
location_api = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDquIyw7VavxhKCE8fG6edOIADD6_M4qAU`; 
axios.get(location_api).then((res)=>{
    if(res.data.status === "ZERO_RESULTS"){
        throw new Error("Unable to find the address");
    } 
    else {
        // console.log(JSON.stringify(res.data, undefined, 2))
        weather_api = `https://api.darksky.net/forecast/52192a33fa4c28c5945648f3c7b7742b/${res.data.results[0].geometry.location.lat},${res.data.results[0].geometry.location.lng}`;
        console.log(weather_api)
        axios.get(weather_api).then((res)=> {
            if(res.status===400)
                console.log("Could not process weather");
            else if(res.status===200){
                console.log("Curent Temperature", res.data.currently.temperature);
                console.log("Current Humidity", res.data.currently.humidity); 
                console.log("Current Pressure", res.data.currently.pressure)
            }
        })
    }
})
.catch((err)=>{
    console.log(err)
})