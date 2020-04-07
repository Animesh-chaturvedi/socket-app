//User Schema
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
  });
  
  var User = mongoose.model("User",userSchema);
  
  module.exports = mongoose.model("User", userSchema);