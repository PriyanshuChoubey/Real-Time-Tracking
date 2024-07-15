//here we write our backend js file

const express = require("express");
const app = express();
const path = require("path");

const http = require("http");       //http server only support socket.io 
const socketio = require("socket.io");
const { log } = require("console");
const server = http.createServer(app);  //method to create http server is createServer()

const io = socketio(server);    //now server and socketio is connected

//now lets set ejs
app.set("view engine","ejs");
app.set(express.static(path.join(__dirname,"public"))); //here static files are setup

io.on("connection",function(socket){    //this will handle the request make by io in frontend
    socket.on("send-location", function(data){
        io.emit("receive-location",{id:socket.id, ...data})
    });
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
    })
});

app.get("/",function(req,res){
    res.render("index");
});

server.listen(3000);