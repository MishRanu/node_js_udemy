const express = require('express'); 

var app = express(); 

app.get('/', (req, res)=>{
    res.status(404).send({
    error: 'Page not found', 
    name: 'Custom app v1.2',    
    }); 
});

app.get('/users', (req,res)=>{
    res.status(200).send([
        {name: 'Anurag', 
        age: 24},
        {name: 'Arvind',
        age: 22},
        {name: 'Suyash',
        age: 24}
    ]);
});

app.listen(3000); 
module.exports.app = app;