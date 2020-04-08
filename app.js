var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
User = require('./public/modules/user.js');
Message = require('./public/modules/message.js');
//var routes = require('/public/routes')

app.use(session({
  secret:"smoke weed everyday",
  resave : false,
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
mongoose.connect("mongodb+srv://shanky:shanky98@socket-app-elljr.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true },function(err, db){
  if(err){
    console.log(err);
  }else{
    console.log("connected db");
  };
});






app.get('/', function(req, res,next) {
  res.sendFile(__dirname + '/public/signup.html');
});


app.get('/chat',isLoggedIn, function(req, res,next) {
  res.sendFile(__dirname + '/public/index.html');
});


app.get("/login",function(req, res, next){
  res.sendFile(__dirname + '/public/login.html');
});



app.get("/logout",function(req, res){
  req.logOut();
  res.redirect("/login");
})


app.post("/",function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err,user){
     if(err){
       console.log(err);
       res.redirect("/")
     }
     passport.authenticate("local")(req,res,function(){
       res.redirect("/chat");
     })
  })
});

app.post("/login", passport.authenticate("local",{
  successRedirect:"/chat",
  failureRedirect:"/login"
}));


//FUNCTION TO CHECK USER LOGIN
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login");
}

io.on('connection', function(socket) {
    console.log('connected socket!');
    
  // FOR CHECKING SOCKET CONNECTION JUST UNCOMMENT THE CODE BELOW

   //socket.on('greet', function(data) {
     //console.log(data);
     //console.log(socket.id);
      //socket.emit('respond', { hello: 'Hey, Mr.Client!' });
     //});


     
     Message.find({}, function(err, docs) {
      if(err) throw err;
      console.log('sending previous messages');
      io.emit("load old messages", docs);
   });

    socket.on('chat message', function(msg,name){
      io.emit('chat message', msg,name);
      Message.create({name:name, text:msg}, function(err,suc){
        if(err){
          console.log(err)
        }else{
          console.log("success")
        }
      });
  
      //console.log(socket.id + ': ' + msg +' '+name);
      //console.log(socket.id); 
    });
    socket.on('disconnect', function() {
      console.log('Socket disconnected');
    });
  });

server.listen(4200);