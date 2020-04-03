var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {
    console.log('connected socket!');
  
   // socket.on('greet', function(data) {
     // console.log(data);
     // socket.emit('respond', { hello: 'Hey, Mr.Client!' });
   // });
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
      console.log('message: ' + msg);
    });
    socket.on('disconnect', function() {
      console.log('Socket disconnected');
    });
  });

server.listen(4200);