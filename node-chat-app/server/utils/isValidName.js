module.exports.isValidName = (name)=>{
    if(typeof name === 'string' && name.trim().length!=0)
        return name.trim(); 
    else return false; 
};