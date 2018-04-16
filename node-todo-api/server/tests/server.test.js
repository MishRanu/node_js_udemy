const expect = require('expect');
const request = require('supertest');
const {Todo} = require('./../models/todo.js'); 
const {User} = require('./../models/user.js'); 
const {app} = require('./../server.js'); 
const {ObjectID} = require('mongodb');

const todos = [{
    _id: new ObjectID(), 
    text: "First test todo"
},
{
    _id: new ObjectID(), 
    text: "Second test todo", 
    completed: true, 
    completedAt: 33
}]; 



describe("GET /", function(){
    this.timeout(10000);      
    it('check the welcome page of the website', (done)=> {
        request(app)
        .get('/')
        .expect(200)
        .expect((res)=>{
            expect(res.body).toBeTruthy();
        })
        .end(done);
    });
});

describe("POST /todos", function() {
    this.timeout(10000);  
    beforeEach(function(){
        return Todo.remove({})
        .then(function(){
            return Todo.insertMany(todos); 
        }); 
    }); 
      
    it('should test the scenario with valid inputs', (done)=> {
        var text = "Some test text here";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if(err)
                    return done(err);
                
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text); 
                    done(); 
                }).catch((e)=> done(e)); 
            });
    });

    it('should test the scenario with invalid input', (done)=>{
        
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res)=>{
                if(err)
                    return done(err); 
                
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2); 
                    done(); 
                }).catch((e)=>done(e)) 
            }); 
    }); 
});


describe("GET /todos", function(){
    beforeEach(function(){
        return Todo.remove({})
        .then(function(){
            return Todo.insertMany(todos); 
        }); 
    }); 
    it('should test that the api returns all the todos', function(done){

        request(app)
            .get('/todos')
            .expect(200)
            .expect(function(res){
                expect(res.body.docs.length).toBe(2); 
            })
            .end(done); 
    }); 
});


describe("GET /todos/:id", function(){
    beforeEach(function(){
        return Todo.remove({})
        .then(function(){
            return Todo.insertMany(todos); 
        }); 
    }); 

    it("should return the todo with specified id", (done)=>{

        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.docs.text).toBe(todos[0].text);
        })
        .end(done); 
    }); 
})