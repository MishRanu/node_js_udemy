request = require('request')

var weatherdata = (coords) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://api.darksky.net/forecast/52192a33fa4c28c5945648f3c7b7742b/${coords.latitude},${coords.longitude}`,
            json: true
        }, (error, response, body)=>{
            if(error){
                reject("Couldnot connect to forecast.io servers");
            }
            else if(response.statusCode=== 400){
                reject("Could not process weather");
            }
            else if(response.statusCode === 200){
                resolve({
                    temperature: body.currently.temperature, 
                    humidity: body.currently.humidity,
                    pressure: body.currently.pressure
                });
            }
        })
    })
}

module.exports = {
    weatherdata
}