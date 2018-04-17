const expect = require('expect');
const request = require('supertest');
const {Todo} = require('./../models/todo.js'); 
const {User} = require('./../models/user.js'); 
const {app} = require('./../server.js'); 
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed'); 

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
    beforeEach(populateUsers); 
    beforeEach(populateTodos); 
      
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
    beforeEach(populateTodos); 
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
    beforeEach(populateTodos); 

    it("should return the todo with specified id", (done)=>{

        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.docs.text).toBe(todos[0].text);
        })
        .end(done); 
    }); 
}); 


describe("GET /users/me", function(){

    it('should return user if authenticated', (done)=> {

        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString()); 
            expect(res.body.email).toBe(users[0].email); 
        })
        .end(done); 
    });

    it('should return 401 if not authenticated', (done)=> {

        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});   
        })
        .end(done); 
    }); 
}); 


describe("POST /users", ()=>{
    it('should create a user', (done)=>{
        var email = 'example@example.com';
        var password = '123mnb!'; 

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res)=> {
                expect(res.headers['x-auth']).toBeTruthy(); 
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email); 
            })
            .end((err, res)=>{
                if(err)
                    return done(err); 
                
                    User.findOne({email}).then((user)=>{
                        expect(user.email).toBe(email); 
                        expect(user.password).not.toBe(password); 
                        done(); 
                    }).catch((e)=>done(e)); 
            }); 
    }); 

    it('should return validation errors if request invalid', (done)=>{
        var email = 'example2';
        var password = '12';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res)=>{
                expect(res.body._id).toBeFalsy(); 
                expect(res.body.email).toBeFalsy(); 
                // expect(res.body).not.objectContaining({'_id':expect.any(Number), 'email': expect.any(String)}); 
            })
            .end(done); 
    });

    it('should not create user if email in use', (done)=>{
        var email = "example@example.com"; 
        var password = "123abc$"; 
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res)=> {
                expect(res.body._id).toBeFalsy(); 
                expect(res.body.email).toBeFalsy(); 
                // expect(res.body).not.objectContaining({'_id':expect.any(Number), 'email': expect.any(String)});
            })
            .end(done); 
    });
});

describe("POST /users/login", ()=>{
    it('should login user and return auth token', (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email, 
            password:users[1].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res)=> { 
            if(err)
                return done(err);

                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[0]).toMatchObject({
                        access:'auth', 
                        token: res.headers['x-auth']
                    })
                    done(); 
                }).catch((e)=> done(e)); 
        });
    }); 

    it("should return invalid login", (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email, 
            password:"bongo"
        })
        .expect(400)
        .end(done); 
    });
})