const { disconnect } = require("mongoose");
const { on } = require("nodemon");
const {Server} = require("socket.io");

const io = new Server ({ 
    cors : " http://localhost:5173",
    methods: ["GET", "POST"],
}) ;

let onlineUsers = [];
io.on("connection",(socket)=>{
    console.log("new conn",socket.id);

    socket.on("addNewUser",(userId)=>{
        !onlineUsers.some((user) => user.userId  === userId)  &&
        onlineUsers.push({
            userId,
            socketId : socket.id,
        })
        console.log("onlineusers:  ",onlineUsers);
       io.emit("getOnlineUsers",onlineUsers);
    })
//addmsg
    socket.on("sendMessage",(message)=>{
        
        console.log("RecipientId:", message.recipientId);
        const user = onlineUsers.find((user) =>user.userId === message.recipientId)
        if(user){
            io.to(user.socketId).emit("getMessage",message);
            
            // console.log("Received Message:", message);
            io.to(user.socketId).emit("getNotification",{
                senderId:message.senderId,
                isRead: false,
                date: new Date(),

            });
        }
    });
    DEBUG=socket.io
    socket.on("disconnect",()=>{
        onlineUsers = onlineUsers.filter((user)=> user.socketId !==socket.id)
        
        io.emit("getOnlineUsers",onlineUsers);
    });
});
io.listen(3000);

