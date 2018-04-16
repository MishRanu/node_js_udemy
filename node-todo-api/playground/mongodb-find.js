const MongoClient = require('mongodb').MongoClient; 

const url = 'mongodb://localhost:27017'; 
const dbName = 'TodoApp'; 

MongoClient.connect(url, (err, client)=>{

    if(err){
        return console.log("Unable to connect to the database server"); 
    }
    console.log("Connected to the MongoDB server"); 
    const db = client.db(dbName); 

    db.collection('Users').find({name: "Anurag Misra"}).toArray((err, docs)=>{
        if(err){
            return console.log("There seems to be some error", err); 
        }
        console.log(JSON.stringify(docs, undefined, 2)); 
    });


    client.close(); 
});