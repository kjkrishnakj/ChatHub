const express = require ("express");
const cors = require ("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
require("dotenv").config();
const app =express();

app.use(express.json());
app.use(cors());
app.use("/api/users",userRoute);
app.use("/api/chats",chatRoute);
try{

    app.use("/api/messages",messageRoute);
}
catch(e){
    console.log(e);
}


app.get("/",(req,res)=>{
    res.send("welcome to the chat API");
})



const port = 5000;
app.listen(port,(req,res)=>{
    console.log(`running on port : ${port}`);
});

mongoose.connect('mongodb://0.0.0.0:27017/ChatHub', { 
    useNewUrlParser: true,
     useUnifiedTopology: true
}).then(()=>console.log("mongodb connected"));