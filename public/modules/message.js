//Message Schema
var mongoose = require('mongoose');
var messageSchema = new mongoose.Schema({
    name: String,
    text: String,
  });
  
  var Message = mongoose.model("Message",messageSchema);
  module.exports = mongoose.model("Message", messageSchema);