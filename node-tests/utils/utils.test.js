const utils = require('./utils'); 
const expect = require('expect'); 


describe('Utils', ()=> {

it('should add two numbers', ()=> {
    var res = utils.add(33, 11); 
    expect(res).toBe(44).toBeA('number');
    // if(res !== 44)
        // throw new Error(`Expected 44 but got ${res}`)
}); 

it('should square a number', ()=> {
    var res = utils.square(11); 
    expect(res).toBe(121).toBeA('number');
    // if(res!==121){
    //     throw new Error(`Expected 121 but got ${res}`)
    // }
});
//Behavior dependent development

it('should add two numbers aysnchronously', (done)=>{
    utils.asyncAdd(4, 3, (sum)=>{
        expect(sum).toBe(7).toBeA('number');
        done();
    });
}); 

it('should square a number asynchronously', (done)=>{
    utils.asyncSquare(3, (sum)=>{
        expect(sum).toBe(9).toBeA('number');
        done();
    });
}); 
}); 
