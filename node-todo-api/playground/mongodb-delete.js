const {MongoClient, ObjectId} = require('mongodb'); 
const url = "mongodb://localhost:27017";
const dbName = "TodoApp"; 

MongoClient.connect(url, (err, client)=> {
    if(err){
        return console.log("Could not connect to the database", db); 
    }
    console.log("Connected to the database"); 
    db = client.db(dbName);

    db.collection('Users').deleteOne({name: 'Anurag Misra'})
    .then((res)=> {
        console.log("Successfully deleted data", res);
    })
    .catch((err)=>{
        console.log("Could not delete data", err); 
    })
    client.close(); 
})