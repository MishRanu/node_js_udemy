const express = require('express'); 
const hbs = require('hbs'); 

var app = express(); 

hbs.registerPartials(__dirname + '/views/partials')
//Piece of express middleware
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public')); 

hbs.registerHelper('getCurrentYear', ()=> {
    return 'Date' + new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase()
}
)
app.get('/', (req, res)=>{
    // res.send("<h1>Hello Express</h1>"); 
    res.render('home.hbs', {
        pageTitle: 'Home Page', 
        welcomeMessage: "Welcome to some website"
    });
}); 

app.get('/about', (req, res)=>{
    res.render('about.hbs', {
        pageTitle: 'About Page', 
    });
});

app.get('/bad', (req, res)=> {
    res.send({
        errorMessage: "Error processing request"
    });
});

app.listen(3000, ()=> {
    console.log("Server is up on port 3000")
});