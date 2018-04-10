request = require('request')

var geocodeAddress = (address) => {
    return new Promise((resolve, reject)=> { 
        var encodedAddress = encodeURIComponent(address)
        request({
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDquIyw7VavxhKCE8fG6edOIADD6_M4qAU`, 
            json: true
        }, (error, response, body)=>{
            if(error){
                reject("Unable to connect to Google servers");
            }
            else if(body.status==='ZERO_RESULTS'){
                reject("Unable to find the address");
            }
            else if(body.status==='OK') {
                // console.log(JSON.stringify(body, undefined, 2)); 
                resolve({
                    address: body.results[0].formatted_address, 
                    latitude: body.results[0].geometry.location.lat, 
                    longitude: body.results[0].geometry.location.lng
                });
            }
        });
    });
}

module.exports = {
    geocodeAddress
};