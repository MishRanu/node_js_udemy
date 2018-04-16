const {MongoClient, ObjectId} = require('mongodb'); 
const url = "mongodb://localhost:27017"; 
const dbName = "TodoApp"


MongoClient.connect(url, (err, client)=> {

    if(err){
        return console.log("Could not connect to the database", err); 
    }
    
    console.log("Successfully connected to the database"); 
    db = client.db(dbName); 
    db.collection('Users').updateOne({name: "Anurag Misra"},
{$set: {
    age: 25
}}, (err, res)=> {
    if(err){
        return console.log("Could not process request", err); 
    }
    console.log(res.result.ok)
});
client.close();
});