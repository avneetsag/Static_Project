const mongoose = require('mongoose');
module.exports = mongoose.model('fridge', new mongoose.Schema({
 id:String,
  name: String,
 user: String,
sensorData:Array
   }));
