class Users{
    constructor(){
        this.users=[];
    }

    addUser(socketId, username, room){
        var user = {socketId, username, room}; 
        this.users.push(user); 
        return user;         
    }

    removeUser(socketId){
        this.users = this.users.filter((user)=>user.socketId!=socketId); 
    }

    listUsers(room){
        let roomUsers = this.users.filter((user)=>user.room===room); 
        userNames = roomUsers.map((user)=> user=user.username); 
        return userNames; 
    }

    getUser(socketId){
        return this.users.filter((user)=>user.socketId===socketId)[0]; 
    }

}

module.exports = {
    Users
}