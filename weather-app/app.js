const yargs = require('yargs')
const geocode = require('./geocode/geocode.js');
const weather_data = require('./weather_data/weather_data.js')

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

console.log(argv); 
geocode.geocodeAddress(argv.address).then((results)=> {
    console.log(JSON.stringify(results, undefined, 2));
    var coords = {
        'latitude': results.latitude, 
        'longitude': results.longitude
    };
    console.log(coords);
    weather_data.weatherdata(coords).then((results)=> { 
            console.log(JSON.stringify(results, undefined, 2));
    })
})
.catch((errorMessage)=> {
    console.log(errorMessage)
})