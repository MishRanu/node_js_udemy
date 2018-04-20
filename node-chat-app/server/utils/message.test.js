var expect = require('expect'); 
var {generateMessage} = require('./message'); 


describe('generateMessage', ()=>{
    it('should generate correct message object', ()=>{
        var from = 'Jan'; 
        var text = 'Hi Michael! This is Jan';
        var message = generateMessage(from, text); 
        expect(message._createdAt).toEqual(expect.any(Number));
        expect(message).toMatchObject({from, text}); 
    })
    
}); 